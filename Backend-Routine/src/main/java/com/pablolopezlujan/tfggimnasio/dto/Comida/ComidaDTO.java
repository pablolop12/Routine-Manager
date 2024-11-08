package com.pablolopezlujan.tfggimnasio.dto.Comida;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComidaDTO {
    private Long id;
    private String tipoComida;
    private String nombre;
    private String descripcion;
    private Integer calorias;
    private String imagenUrl;
    private Long usuarioId;
}
