package com.pablolopezlujan.tfggimnasio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Establece qué comidas se incluyen en cada dieta y en qué días, facilitando la
 * organización de un plan de comidas semanal.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dietas_comidas")
public class DietaComida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dieta_id", nullable = false)
    private Dieta dieta;

    @ManyToOne
    @JoinColumn(name = "comida_id", nullable = false)
    private Comida comida;

    @Column(name = "dia", nullable = false)
    private String dia; // "Lunes", "Martes", ..., "Domingo"

    @Column(name = "nombre_dia", length = 100)
    private String nombreDia; // "Día de proteínas", "Día de vegetales", etc.

    @Column(name = "tipo_comida", nullable = false)
    private String tipoComida; // "Desayuno", "Almuerzo", "Comida", "Merienda", "Cena"

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad; // Agregado para mantener paralelismo con RutinaEjercicio
    
    @Override
    public String toString() {
        return "DietaComida{" +
                "id=" + id +
                ", dia='" + dia + '\'' +
                ", nombreDia='" + nombreDia + '\'' +
                ", tipoComida='" + tipoComida + '\'' +
                ", cantidad=" + cantidad + // Agregado para mantener paralelismo con RutinaEjercicio
                '}';
    }
}
