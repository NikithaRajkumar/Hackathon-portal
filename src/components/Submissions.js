function Submissions() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Submission received!');
    };

    return (
        <div>
            <h2>Submissions</h2>
            <div className="submission-form">
                <h3>Submit Your Solution</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Project Title" required />
                    <textarea placeholder="Project Description" required></textarea>
                    <input type="url" placeholder="GitHub Repository URL" required />
                    <input type="url" placeholder="Live Demo URL" />
                    <button type="submit" className="btn-primary">Submit Project</button>
                </form>
            </div>
            <div className="submissions-list">
                <p>No submissions yet.</p>
            </div>
        </div>
    );
}