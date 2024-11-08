package com.pablolopezlujan.tfggimnasio.dto.Ejercicio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EjercicioDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private String imagenUrl;
}
