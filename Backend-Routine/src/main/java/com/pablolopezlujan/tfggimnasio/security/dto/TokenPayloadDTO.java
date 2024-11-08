package com.pablolopezlujan.tfggimnasio.security.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TokenPayloadDTO {
    // Token Payload
    private Long id;
    private String name;
    private String lastname;
    private String email;
    private String role;
}
