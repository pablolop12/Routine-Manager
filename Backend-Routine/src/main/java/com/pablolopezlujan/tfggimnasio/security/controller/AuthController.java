package com.pablolopezlujan.tfggimnasio.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pablolopezlujan.tfggimnasio.security.dto.LoginCredential;
import com.pablolopezlujan.tfggimnasio.security.dto.RegisterRequest;
import com.pablolopezlujan.tfggimnasio.security.dto.TokenDto;
import com.pablolopezlujan.tfggimnasio.security.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "${app.frontend.url}")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenDto login(@RequestBody LoginCredential request) {
        logger.info("POST /auth/login usuario:" + request.getEmail() + " contraseña:" + request.getPassword());
        return authService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterRequest register(@RequestBody RegisterRequest request) {
        logger.info("POST /auth/register usuario:" + request.getEmail() + " contraseña:" + request.getPassword());
        return authService.register(request);
    }

    @PostMapping("/register-admin")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterRequest registerAdmin(@RequestBody RegisterRequest request) {
        logger.info("POST /admin/register");
        return authService.registerAdmin(request);
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestParam("token") String token) {
        String result = authService.confirmToken(token);
        String htmlResponse = "<html>"
                + "<head><meta http-equiv='refresh' content='4;url=" + frontendUrl + "/auth/login'></head>"
                + "<body>"
                + "<h1>" + result + "</h1>"
                + "<p>Sera redirigido a la página en unos segundos...</p>"
                + "</body>"
                + "</html>";
        return new ResponseEntity<>(htmlResponse, HttpStatus.OK);
    }

    // Endpoint para enviar correo de recuperación de contraseña
    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.OK)
    public void forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        authService.sendPasswordResetEmail(email);
    }

    // Endpoint para restablecer la contraseña
    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    public void resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        authService.resetPassword(token, newPassword);
    }
}
