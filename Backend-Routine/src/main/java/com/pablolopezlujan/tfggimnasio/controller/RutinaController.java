package com.pablolopezlujan.tfggimnasio.controller;


import com.pablolopezlujan.tfggimnasio.dto.Rutina.RutinaDTO;
import com.pablolopezlujan.tfggimnasio.security.dto.TokenPayloadDTO;
import com.pablolopezlujan.tfggimnasio.security.service.AuthService;
import com.pablolopezlujan.tfggimnasio.service.RutinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/rutinas")
public class RutinaController {

    private static final Logger logger = LoggerFactory.getLogger(RutinaController.class);

    @Autowired
    private RutinaService rutinaService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<RutinaDTO> createRutina(@RequestBody RutinaDTO rutinaDTO, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        rutinaDTO.setUsuarioId(payload.getId());
        RutinaDTO createdRutina = rutinaService.createRutina(rutinaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRutina);
    }

    @GetMapping
    public ResponseEntity<List<RutinaDTO>> getAllRutinas(@RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        List<RutinaDTO> rutinas = rutinaService.getRutinasByUserId(payload.getId());
        return ResponseEntity.status(HttpStatus.OK).body(rutinas);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Void> activateRutina(@PathVariable Long id, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        rutinaService.activateRutina(id, payload.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRutina(@PathVariable Long id) {
        rutinaService.deleteRutina(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutinaDTO> getRutinaById(@PathVariable Long id, @RequestHeader(name = "Authorization") String token) {
        authService.getPayloadFromToken(token); // Validar el token
        RutinaDTO rutinaDTO = rutinaService.getRutinaById(id);
        return ResponseEntity.status(HttpStatus.OK).body(rutinaDTO);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RutinaDTO> updateRutina(@PathVariable Long id, @RequestBody RutinaDTO rutinaDTO) {
        rutinaDTO.setId(id); // Asegúrate de que el DTO tiene el ID correcto
        logger.info("Actualizando rutina con ID: {}", id); // Log para verificar múltiples solicitudes
        RutinaDTO updatedRutina = rutinaService.updateRutina(id, rutinaDTO);
        logger.info("Rutina actualizada con éxito: {}", updatedRutina);
        return ResponseEntity.ok(updatedRutina);
    }
    
    @GetMapping("/active")
    public ResponseEntity<RutinaDTO> getActiveRutina(@RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        RutinaDTO rutinaDTO = rutinaService.getActiveRutinaByUserId(payload.getId());
        return ResponseEntity.status(HttpStatus.OK).body(rutinaDTO);
    }
}
