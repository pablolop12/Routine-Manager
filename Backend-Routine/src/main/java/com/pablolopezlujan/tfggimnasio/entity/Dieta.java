package com.pablolopezlujan.tfggimnasio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Registra las dietas que los usuarios crean y siguen, vinculando cada dieta a
 * un usuario específico.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dietas")
public class Dieta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_dieta", nullable = false)
    private String nombreDieta;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @OneToMany(mappedBy = "dieta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DietaComida> dietaComidas;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "start_date")
    private java.sql.Date startDate; // Agregado para mantener paralelismo con Rutina

    @Override
    public String toString() {
        return "Dieta{" +
                "id=" + id +
                ", nombreDieta='" + nombreDieta + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", isActive=" + isActive +
                ", startDate=" + startDate + // Agregado para mantener paralelismo con Rutina
                '}';
    }
}
