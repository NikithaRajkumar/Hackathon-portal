const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const pool = require('./db');
const initDB = require('./initDB');
const mailer = require('./mailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ── AUTH ──────────────────────────────────────────────────────────────────────
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
        if (exists.rows.length) return res.status(400).json({ error: 'Email already registered' });
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role',
            [name, email, hash, 'user']
        );
        mailer.sendWelcome(email, name);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── USERS ─────────────────────────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
    const result = await pool.query('SELECT id,name,email,role FROM users ORDER BY id');
    res.json(result.rows);
});

app.delete('/api/users/:id', async (req, res) => {
    await pool.query('DELETE FROM users WHERE id=$1 AND role!=\'admin\'', [req.params.id]);
    res.json({ success: true });
});

// ── HACKATHONS ────────────────────────────────────────────────────────────────
app.get('/api/hackathons', async (req, res) => {
    const result = await pool.query('SELECT * FROM hackathons ORDER BY id');
    res.json(result.rows);
});

app.post('/api/hackathons', async (req, res) => {
    const { title, description, status, start_date, end_date } = req.body;
    const result = await pool.query(
        'INSERT INTO hackathons (title,description,status,start_date,end_date) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [title, description || '', status || 'Active', start_date || null, end_date || null]
    );
    res.json(result.rows[0]);
});

app.put('/api/hackathons/:id', async (req, res) => {
    const { title, description, status, start_date, end_date } = req.body;
    const result = await pool.query(
        'UPDATE hackathons SET title=$1,description=$2,status=$3,start_date=$4,end_date=$5 WHERE id=$6 RETURNING *',
        [title, description, status, start_date || null, end_date || null, req.params.id]
    );
    res.json(result.rows[0]);
});

app.delete('/api/hackathons/:id', async (req, res) => {
    await pool.query('DELETE FROM hackathons WHERE id=$1', [req.params.id]);
    res.json({ success: true });
});

// ── TEAMS ─────────────────────────────────────────────────────────────────────
app.get('/api/teams', async (req, res) => {
    const teams = await pool.query('SELECT * FROM teams ORDER BY id');
    const members = await pool.query('SELECT * FROM team_members');
    const result = teams.rows.map(t => ({
        ...t,
        members: members.rows.filter(m => m.team_id === t.id).map(m => m.user_name)
    }));
    res.json(result);
});

app.post('/api/teams', async (req, res) => {
    const { name, hackathon_id, created_by } = req.body;
    const team = await pool.query(
        'INSERT INTO teams (name,hackathon_id,created_by) VALUES ($1,$2,$3) RETURNING *',
        [name, hackathon_id, created_by]
    );
    await pool.query('INSERT INTO team_members (team_id,user_name) VALUES ($1,$2)', [team.rows[0].id, created_by]);
    const members = await pool.query('SELECT user_name FROM team_members WHERE team_id=$1', [team.rows[0].id]);
    res.json({ ...team.rows[0], members: members.rows.map(m => m.user_name) });
});

app.put('/api/teams/:id', async (req, res) => {
    const { name } = req.body;
    const result = await pool.query('UPDATE teams SET name=$1 WHERE id=$2 RETURNING *', [name, req.params.id]);
    res.json(result.rows[0]);
});

app.delete('/api/teams/:id', async (req, res) => {
    await pool.query('DELETE FROM teams WHERE id=$1', [req.params.id]);
    res.json({ success: true });
});

app.post('/api/teams/:id/members', async (req, res) => {
    const { user_name } = req.body;
    const team = await pool.query('SELECT * FROM teams WHERE id=$1', [req.params.id]);
    const members = await pool.query('SELECT * FROM team_members WHERE team_id=$1', [req.params.id]);
    if (members.rows.length >= team.rows[0].max_members) return res.status(400).json({ error: 'Team is full' });
    if (members.rows.find(m => m.user_name === user_name)) return res.status(400).json({ error: 'Already a member' });
    await pool.query('INSERT INTO team_members (team_id,user_name) VALUES ($1,$2)', [req.params.id, user_name]);
    res.json({ success: true });
});

app.delete('/api/teams/:id/members/:name', async (req, res) => {
    await pool.query('DELETE FROM team_members WHERE team_id=$1 AND user_name=$2', [req.params.id, req.params.name]);
    const remaining = await pool.query('SELECT COUNT(*) FROM team_members WHERE team_id=$1', [req.params.id]);
    if (parseInt(remaining.rows[0].count) === 0) {
        await pool.query('DELETE FROM teams WHERE id=$1', [req.params.id]);
    }
    res.json({ success: true });
});

// ── PROBLEMS ──────────────────────────────────────────────────────────────────
app.get('/api/problems', async (req, res) => {
    const result = await pool.query('SELECT * FROM problems ORDER BY id');
    res.json(result.rows);
});

app.post('/api/problems', async (req, res) => {
    const { title, description, difficulty, hackathon_id } = req.body;
    const result = await pool.query(
        'INSERT INTO problems (title,description,difficulty,hackathon_id) VALUES ($1,$2,$3,$4) RETURNING *',
        [title, description, difficulty, hackathon_id]
    );
    res.json(result.rows[0]);
});

app.put('/api/problems/:id', async (req, res) => {
    const { title, description, difficulty } = req.body;
    const result = await pool.query(
        'UPDATE problems SET title=$1,description=$2,difficulty=$3 WHERE id=$4 RETURNING *',
        [title, description, difficulty, req.params.id]
    );
    res.json(result.rows[0]);
});

app.delete('/api/problems/:id', async (req, res) => {
    await pool.query('DELETE FROM problems WHERE id=$1', [req.params.id]);
    res.json({ success: true });
});

// ── SUBMISSIONS ───────────────────────────────────────────────────────────────
app.get('/api/submissions', async (req, res) => {
    const result = await pool.query('SELECT * FROM submissions ORDER BY id');
    res.json(result.rows);
});

app.post('/api/submissions', upload.single('file'), async (req, res) => {
    const { title, description, github, demo, hackathon_id, submitted_by, user_email } = req.body;
    const file_path = req.file ? req.file.filename : null;
    const result = await pool.query(
        'INSERT INTO submissions (title,description,github,demo,file_path,hackathon_id,submitted_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [title, description, github, demo || null, file_path, hackathon_id, submitted_by]
    );
    if (user_email) mailer.sendSubmissionConfirm(user_email, title);
    res.json(result.rows[0]);
});

app.put('/api/submissions/:id/evaluate', async (req, res) => {
    const { score, user_email, title } = req.body;
    const result = await pool.query(
        'UPDATE submissions SET score=$1 WHERE id=$2 RETURNING *',
        [score, req.params.id]
    );
    if (user_email) mailer.sendEvaluationResult(user_email, title, score);
    res.json(result.rows[0]);
});

// ── START ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.error);
