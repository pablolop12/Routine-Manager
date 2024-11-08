package com.pablolopezlujan.tfggimnasio.security.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginCredential {

    private String email;

    @NotEmpty
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=])(?!.*[.]).{8,20}$", 
        message = "La contraseña debe tener al menos una letra minúscula, una letra mayúscula, un dígito, un símbolo especial, y debe tener entre 8 y 20 caracteres."
    )
    private String password;
}
