package com.pablolopezlujan.tfggimnasio.repository;

import com.pablolopezlujan.tfggimnasio.entity.Ejercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EjercicioRepository extends JpaRepository<Ejercicio, Long> {
}
