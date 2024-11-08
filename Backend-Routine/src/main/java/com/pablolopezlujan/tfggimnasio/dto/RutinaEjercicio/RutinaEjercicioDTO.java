package com.pablolopezlujan.tfggimnasio.dto.RutinaEjercicio;

import com.pablolopezlujan.tfggimnasio.entity.RutinaEjercicio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RutinaEjercicioDTO {
    private Long id;
    private Long ejercicioId;
    private String dia;
    private String nombreDia;
    private Integer repeticiones;
    private Integer series;
    private Float peso;

    // Constructor que acepta una entidad RutinaEjercicio
    public RutinaEjercicioDTO(RutinaEjercicio rutinaEjercicio) {
        this.id = rutinaEjercicio.getId();
        this.ejercicioId = rutinaEjercicio.getEjercicio().getId();
        this.dia = rutinaEjercicio.getDia();
        this.nombreDia = rutinaEjercicio.getNombreDia();
        this.repeticiones = rutinaEjercicio.getRepeticiones();
        this.series = rutinaEjercicio.getSeries();
        this.peso = rutinaEjercicio.getPeso();
    }
}
