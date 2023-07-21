package nus.iss.tfip.miniProject.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nus.iss.tfip.miniProject.payload.request.EmailRequest;
import nus.iss.tfip.miniProject.payload.response.MessageResponse;
import nus.iss.tfip.miniProject.services.EmailService;

@RestController
@RequestMapping("/api")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<MessageResponse> sendEmail(@RequestBody EmailRequest emailRequest) {
        emailService.sendEmail(emailRequest.getToEmail(), emailRequest.getBody(), emailRequest.getSubject());
        return ResponseEntity.ok(new MessageResponse("Email Sent"));
    }
}
