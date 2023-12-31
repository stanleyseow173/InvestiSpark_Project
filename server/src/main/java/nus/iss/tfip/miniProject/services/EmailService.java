package nus.iss.tfip.miniProject.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import nus.iss.tfip.miniProject.repositories.mongo.WatchlistRepository;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Value("${spring.mail.username}")
    private String gmailUsername;

    @Value("${spring.mail.password}")
    private String gmailPassword;

    public void sendEmail(String toEmail, String body, String subject) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
            message.setContent(body, "text/html");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            // System.out.println("ToEmail =:" + toEmail);
            // System.out.println("Body =:" + body);
            // System.out.println("Gmail username =:" + gmailUsername);
            // System.out.println("Gmail password =:" + gmailPassword);
            mailSender.send(message);
        } catch (MessagingException ex) {
            ex.printStackTrace();
        }
    }

    public List<String> getAllEmails() {
        return watchlistRepository.getAllEmails();
    }
}
