package com.pablolopezlujan.tfggimnasio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pablolopezlujan.tfggimnasio.entity.User;
import com.pablolopezlujan.tfggimnasio.repository.UserRepository;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Transactional
    public void sendPasswordResetEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("No user found with email " + email);
        }

        User user = userOptional.get();
        user.setResetPasswordToken(UUID.randomUUID().toString());
        user.setResetPasswordExpires(new Date(System.currentTimeMillis() + 3600000)); // 1 hour expiry
        userRepository.save(user);

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("Password Reset solicitud");
        emailMessage.setText("Para resetear tu contraseña haz click en este enlace:\n" +
                frontendUrl + "/reset-password?token=" + user.getResetPasswordToken());

        mailSender.send(emailMessage);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetPasswordToken(token);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("Invalid token");
        }

        User user = userOptional.get();
        if (user.getResetPasswordExpires().before(new Date())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(newPassword); // Remember to hash the password in real implementation
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        userRepository.save(user);
    }
}
