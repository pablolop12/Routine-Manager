package com.pablolopezlujan.tfggimnasio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Contiene detalles sobre los ejercicios disponibles que los usuarios pueden
 * agregar a sus rutinas. Incluye una descripción y una imagen para ilustrar
 * cómo realizar cada ejercicio.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ejercicios")
public class Ejercicio {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nombre", nullable = false, length = 100)
	private String nombre;

	@Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
	private String descripcion;

	@Column(name = "categoria", nullable = false)
	private String categoria;

	@Column(name = "imagen_url")
	private String imagenUrl;
}
