package com.pablolopezlujan.tfggimnasio.dto.User;

import java.util.List;

import com.pablolopezlujan.tfggimnasio.dto.Dieta.DietaDTO;
import com.pablolopezlujan.tfggimnasio.dto.Rutina.RutinaDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	private Long id;
    private String email;
    private String name;
    private String lastname;
    private String role;
    private String movil;
    private List<RutinaDTO> rutinas;
    private List<DietaDTO> dietas;
}