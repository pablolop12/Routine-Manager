package com.pablolopezlujan.tfggimnasio.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private Long id;
    
    @Email
    @NotEmpty
    private String email;
    
    @NotEmpty
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=])(?!.*[.]).{8,20}$", 
        message = "La contraseña debe tener al menos una letra minúscula, una letra mayúscula, un dígito, un símbolo especial, y debe tener entre 8 y 20 caracteres."
    )
    private String password;
    
    private String name;
    private String lastname;
    
    private String movil;
    
    private String roles;
}
