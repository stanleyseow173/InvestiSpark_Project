package nus.iss.tfip.miniProject.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

    public void sendEmail(String toEmail, String body, String subject) {
  
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
            message.setContent(body, "text/html");
            helper.setTo(toEmail);
            helper.setSubject(subject);

            mailSender.send(message);
        } catch(MessagingException ex){
            ex.printStackTrace();
        }
    }

    public List<String> getAllEmails(){
        return watchlistRepository.getAllEmails();
    }
}
