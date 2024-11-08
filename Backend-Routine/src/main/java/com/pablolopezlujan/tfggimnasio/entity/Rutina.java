package com.pablolopezlujan.tfggimnasio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Almacena las rutinas de ejercicios que los usuarios crean. Cada rutina está
 * vinculada a un usuario específico y puede contener varios ejercicios.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rutinas")
public class Rutina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_rutina", nullable = false, length = 100)
    private String nombreRutina;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "start_date")
    private java.sql.Date startDate;

    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RutinaEjercicio> rutinaEjercicios;
    
    @Override
    public String toString() {
        return "Rutina{" +
                "id=" + id +
                ", nombreRutina='" + nombreRutina + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", isActive=" + isActive +
                ", startDate=" + startDate +
                '}';
    }

}
