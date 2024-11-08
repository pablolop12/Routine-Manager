package com.pablolopezlujan.tfggimnasio.dto.DietaComida;

import com.pablolopezlujan.tfggimnasio.entity.DietaComida;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietaComidaDTO {
    private Long id;
    private Long comidaId;
    private String dia;
    private String nombreDia;
    private String tipoComida;
    private Integer cantidad;

    // Constructor que acepta una entidad DietaComida
    public DietaComidaDTO(DietaComida dietaComida) {
        this.id = dietaComida.getId();
        this.comidaId = dietaComida.getComida().getId();
        this.dia = dietaComida.getDia();
        this.nombreDia = dietaComida.getNombreDia();
        this.tipoComida = dietaComida.getTipoComida();
        this.cantidad = dietaComida.getCantidad();
    }
}
