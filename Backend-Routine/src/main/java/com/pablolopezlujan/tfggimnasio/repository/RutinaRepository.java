package com.pablolopezlujan.tfggimnasio.repository;

import com.pablolopezlujan.tfggimnasio.entity.Rutina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RutinaRepository extends JpaRepository<Rutina, Long> {

    @Query("SELECT r FROM Rutina r WHERE r.usuario.id = :userId AND r.isActive = true")
    Optional<Rutina> findActiveRutinaByUserId(@Param("userId") Long userId);
    
    List<Rutina> findByUsuarioId(Long usuarioId);
}
