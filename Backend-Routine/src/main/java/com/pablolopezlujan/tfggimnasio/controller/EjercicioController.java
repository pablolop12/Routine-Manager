package com.pablolopezlujan.tfggimnasio.controller;

import com.pablolopezlujan.tfggimnasio.dto.Ejercicio.EjercicioDTO;
import com.pablolopezlujan.tfggimnasio.service.EjercicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ejercicios")
public class EjercicioController {

    @Autowired
    private EjercicioService ejercicioService;

    @PostMapping
    public ResponseEntity<EjercicioDTO> createEjercicio(@RequestBody EjercicioDTO ejercicioDTO) {
        EjercicioDTO createdEjercicio = ejercicioService.createEjercicio(ejercicioDTO);
        return ResponseEntity.ok(createdEjercicio);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EjercicioDTO> getEjercicioById(@PathVariable Long id) {
        EjercicioDTO ejercicioDTO = ejercicioService.getEjercicioById(id);
        return ResponseEntity.ok(ejercicioDTO);
    }

    @GetMapping
    public ResponseEntity<List<EjercicioDTO>> getAllEjercicios() {
        List<EjercicioDTO> ejercicios = ejercicioService.getAllEjercicios();
        return ResponseEntity.ok(ejercicios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EjercicioDTO> updateEjercicio(@PathVariable Long id, @RequestBody EjercicioDTO ejercicioDTO) {
        EjercicioDTO updatedEjercicio = ejercicioService.updateEjercicio(id, ejercicioDTO);
        return ResponseEntity.ok(updatedEjercicio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEjercicio(@PathVariable Long id) {
        ejercicioService.deleteEjercicio(id);
        return ResponseEntity.noContent().build();
    }
}
