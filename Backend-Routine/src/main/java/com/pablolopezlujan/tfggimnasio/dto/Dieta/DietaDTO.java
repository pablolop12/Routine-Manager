package com.pablolopezlujan.tfggimnasio.dto.Dieta;

import com.pablolopezlujan.tfggimnasio.dto.DietaComida.DietaComidaDTO;
import com.pablolopezlujan.tfggimnasio.entity.Dieta;
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
public class DietaDTO {
    private Long id;
    private String nombreDieta;
    private String descripcion;
    private boolean isActive;
    private Date startDate; // Asegúrate de que este campo esté definido
    private Long usuarioId;
    private List<DietaComidaDTO> dietaComidas;

    // Constructor que acepta una entidad Dieta
    public DietaDTO(Dieta dieta) {
        this.id = dieta.getId();
        this.nombreDieta = dieta.getNombreDieta();
        this.descripcion = dieta.getDescripcion();
        this.isActive = dieta.isActive();
        this.startDate = dieta.getStartDate(); // Asegúrate de que este campo esté mapeado
        this.usuarioId = dieta.getUsuario().getId();
        this.dietaComidas = dieta.getDietaComidas()
            .stream()
            .map(DietaComidaDTO::new)
            .collect(Collectors.toList());
    }
}
