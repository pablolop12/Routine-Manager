package com.pablolopezlujan.tfggimnasio.dto.Rutina;

import com.pablolopezlujan.tfggimnasio.dto.RutinaEjercicio.RutinaEjercicioDTO;
import com.pablolopezlujan.tfggimnasio.entity.Rutina;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RutinaDTO {
    private Long id;
    private String nombreRutina;
    private String descripcion;
    private boolean isActive;
    private Date startDate;
    private Long usuarioId;
    private List<RutinaEjercicioDTO> rutinaEjercicios;

    // Constructor que acepta una entidad Rutina
    public RutinaDTO(Rutina rutina) {
        this.id = rutina.getId();
        this.nombreRutina = rutina.getNombreRutina();
        this.descripcion = rutina.getDescripcion();
        this.isActive = rutina.isActive();
        this.startDate = rutina.getStartDate();
        this.usuarioId = rutina.getUsuario().getId();
        this.rutinaEjercicios = rutina.getRutinaEjercicios()
            .stream()
            .map(RutinaEjercicioDTO::new)
            .collect(Collectors.toList());
    }
}
