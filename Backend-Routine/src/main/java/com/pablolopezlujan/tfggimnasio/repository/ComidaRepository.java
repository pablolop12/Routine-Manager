package com.pablolopezlujan.tfggimnasio.repository;

import com.pablolopezlujan.tfggimnasio.entity.Comida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComidaRepository extends JpaRepository<Comida, Long> {
    List<Comida> findByUsuarioId(Long usuarioId);
}
