package com.pablolopezlujan.tfggimnasio.dto.User;


import com.pablolopezlujan.tfggimnasio.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
public class UserDTOFromRutinaDieta {
    @NonNull
    private Long id;
    private String email;
    private String name;
    private String lastname;
    private Role role;
}