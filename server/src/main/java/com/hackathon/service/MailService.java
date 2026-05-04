package com.hackathon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    @Autowired(required = false)
    private JavaMailSender mailSender;

    private void send(String to, String subject, String html) {
        if (mailSender == null) return;
        try {
            var msg = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(msg, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Email failed: " + e.getMessage());
        }
    }

    public void sendWelcome(String email, String name) {
        send(email, "Welcome to Hackathon Platform!", "<h2>Hi " + name + "!</h2><p>Account created successfully.</p>");
    }

    public void sendSubmissionConfirm(String email, String title) {
        send(email, "Submission Received", "<p>Your project <strong>" + title + "</strong> has been submitted.</p>");
    }

    public void sendEvaluationResult(String email, String title, int score) {
        send(email, "Submission Evaluated", "<p><strong>" + title + "</strong> scored <strong>" + score + "/100</strong>.</p>");
    }
}
