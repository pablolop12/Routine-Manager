package com.pablolopezlujan.tfggimnasio.controller;

import com.pablolopezlujan.tfggimnasio.dto.Dieta.DietaDTO;
import com.pablolopezlujan.tfggimnasio.security.dto.TokenPayloadDTO;
import com.pablolopezlujan.tfggimnasio.security.service.AuthService;
import com.pablolopezlujan.tfggimnasio.service.DietaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/dietas")
public class DietaController {

    private static final Logger logger = LoggerFactory.getLogger(DietaController.class);

    @Autowired
    private DietaService dietaService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<DietaDTO> createDieta(@RequestBody DietaDTO dietaDTO, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        dietaDTO.setUsuarioId(payload.getId());
        DietaDTO createdDieta = dietaService.createDieta(dietaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDieta);
    }

    @GetMapping
    public ResponseEntity<List<DietaDTO>> getAllDietas(@RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        List<DietaDTO> dietas = dietaService.getDietasByUserId(payload.getId());
        return ResponseEntity.status(HttpStatus.OK).body(dietas);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Void> activateDieta(@PathVariable Long id, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        dietaService.activateDieta(id, payload.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDieta(@PathVariable Long id) {
        dietaService.deleteDieta(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DietaDTO> getDietaById(@PathVariable Long id, @RequestHeader(name = "Authorization") String token) {
        authService.getPayloadFromToken(token); // Validar el token
        DietaDTO dietaDTO = dietaService.getDietaById(id);
        return ResponseEntity.status(HttpStatus.OK).body(dietaDTO);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DietaDTO> updateDieta(@PathVariable Long id, @RequestBody DietaDTO dietaDTO) {
        dietaDTO.setId(id); // Asegúrate de que el DTO tiene el ID correcto
        logger.info("Actualizando dieta con ID: {}", id); // Log para verificar múltiples solicitudes
        DietaDTO updatedDieta = dietaService.updateDieta(id, dietaDTO);
        logger.info("Dieta actualizada con éxito: {}", updatedDieta);
        return ResponseEntity.ok(updatedDieta);
    }
    
    @GetMapping("/active")
    public ResponseEntity<DietaDTO> getActiveDieta(@RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        DietaDTO dietaDTO = dietaService.getActiveDietaByUserId(payload.getId());
        return ResponseEntity.status(HttpStatus.OK).body(dietaDTO);
    }
}
