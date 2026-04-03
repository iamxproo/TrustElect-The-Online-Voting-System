package com.trustelect.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendCredentials(String to, String name, String voterId, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("TrustElect – Your Voter Credentials");
            message.setText(
                    "Dear " + name + ",\n\n" +
                    "Welcome to TrustElect – DY Patil School of Engineering and Technology, Ambi.\n\n" +
                    "Your voter credentials are:\n" +
                    "  Voter ID : " + voterId + "\n" +
                    "  Password : " + password + "\n\n" +
                    "Please keep these credentials safe and do not share them with anyone.\n\n" +
                    "Regards,\nTrustElect Team"
            );
            mailSender.send(message);
            log.info("Credentials email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send credentials email to {}: {}", to, e.getMessage());
        }
    }

    public void sendOtp(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("TrustElect – Your OTP");
            message.setText(
                    "Your One-Time Password (OTP) for TrustElect login is:\n\n" +
                    "  OTP : " + otp + "\n\n" +
                    "This OTP is valid for 10 minutes. Do not share it with anyone.\n\n" +
                    "Regards,\nTrustElect Team"
            );
            mailSender.send(message);
            log.info("OTP email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
        }
    }
}
