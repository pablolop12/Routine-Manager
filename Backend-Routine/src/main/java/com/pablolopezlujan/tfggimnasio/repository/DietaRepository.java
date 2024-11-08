package com.pablolopezlujan.tfggimnasio.repository;

import com.pablolopezlujan.tfggimnasio.entity.Dieta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DietaRepository extends JpaRepository<Dieta, Long> {
	
	@Query("SELECT d FROM Dieta d WHERE d.usuario.id = :userId AND d.isActive = true")
    Optional<Dieta> findActiveDietaByUserId(@Param("userId") Long userId);
    
    @Query("SELECT d FROM Dieta d WHERE d.usuario.id = :usuarioId")
    List<Dieta> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}
