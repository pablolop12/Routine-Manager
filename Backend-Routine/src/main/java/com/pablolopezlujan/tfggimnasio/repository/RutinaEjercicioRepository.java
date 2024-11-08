/**
 * 
 */
package com.pablolopezlujan.tfggimnasio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pablolopezlujan.tfggimnasio.entity.RutinaEjercicio;

/**
 * 
 */
public interface RutinaEjercicioRepository extends JpaRepository<RutinaEjercicio, Long> {
	List<RutinaEjercicio> findByRutinaId(Long rutinaId);
}
