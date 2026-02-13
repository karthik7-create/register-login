package com.authsystem.registerlogin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendRegistrationSuccessEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Welcome to AuthSystem — Registration Successful! 🎉");
            message.setText(
                    "Hi " + username + ",\n\n" +
                            "Welcome aboard! Your account has been successfully created.\n\n" +
                            "You can now log in using your registered email address.\n\n" +
                            "If you didn't create this account, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "The AuthSystem Team");

            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't break the registration flow
            System.err.println("Failed to send registration email to " + toEmail + ": " + e.getMessage());
        }
    }
}
