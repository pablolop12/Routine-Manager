package com.pablolopezlujan.tfggimnasio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Define la relación entre rutinas y ejercicios, especificando qué ejercicios
 * forman parte de cada rutina, incluyendo detalles como el día y la cantidad
 * de repeticiones y series. En resumen, esta tabla es la encargada de recoger
 * todos los datos para mostrar que hacer cada día. 
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rutinas_ejercicios")
public class RutinaEjercicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rutina_id", nullable = false)
    private Rutina rutina;

    @ManyToOne
    @JoinColumn(name = "ejercicio_id", nullable = false)
    private Ejercicio ejercicio;

    @Column(name = "dia", nullable = false, length = 100)
    private String dia; // "Lunes", "Martes", etc.

    @Column(name = "nombre_dia", length = 100)
    private String nombreDia; // "Día de Pierna", "Día de Brazos", etc.

    @Column(name = "repeticiones")
    private Integer repeticiones;

    @Column(name = "series")
    private Integer series;

    @Column(name = "peso")
    private Float peso;
    
    @Override
    public String toString() {
        return "RutinaEjercicio{" +
                "id=" + id +
                ", dia='" + dia + '\'' +
                ", nombreDia='" + nombreDia + '\'' +
                ", repeticiones=" + repeticiones +
                ", series=" + series +
                ", peso=" + peso +
                // Evita serializar relaciones bidireccionales que podrían causar un loop
                '}';
    }

}