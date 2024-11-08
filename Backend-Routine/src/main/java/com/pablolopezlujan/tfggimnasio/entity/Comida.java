package com.pablolopezlujan.tfggimnasio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Contiene información sobre diferentes tipos de comidas que pueden ser
 * incluidas en las dietas.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comidas")
public class Comida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_comida", nullable = false)
    private String tipoComida;

    @Column(name = "nombre", nullable = false, columnDefinition = "TEXT")
    private String nombre;
    
    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "calorias")
    private Integer calorias;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;
}
