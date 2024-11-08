package com.pablolopezlujan.tfggimnasio.controller;

import com.pablolopezlujan.tfggimnasio.dto.Comida.ComidaDTO;
import com.pablolopezlujan.tfggimnasio.security.dto.TokenPayloadDTO;
import com.pablolopezlujan.tfggimnasio.security.service.AuthService;
import com.pablolopezlujan.tfggimnasio.service.ComidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/comidas")
public class ComidaController {

    @Autowired
    private ComidaService comidaService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<ComidaDTO> createComida(@RequestBody ComidaDTO comidaDTO, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        comidaDTO.setUsuarioId(payload.getId());
        ComidaDTO createdComida = comidaService.createComida(comidaDTO);
        return ResponseEntity.ok(createdComida);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComidaDTO> getComidaById(@PathVariable Long id, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        ComidaDTO comidaDTO = comidaService.getComidaById(id);
        if (!comidaDTO.getUsuarioId().equals(payload.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(comidaDTO);
    }

    @GetMapping
    public ResponseEntity<List<ComidaDTO>> getAllComidas(@RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        List<ComidaDTO> comidas = comidaService.getAllComidas()
                .stream()
                .filter(comida -> comida.getUsuarioId().equals(payload.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(comidas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComidaDTO> updateComida(@PathVariable Long id, @RequestBody ComidaDTO comidaDTO, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        ComidaDTO existingComida = comidaService.getComidaById(id);
        if (!existingComida.getUsuarioId().equals(payload.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        comidaDTO.setId(id);
        ComidaDTO updatedComida = comidaService.updateComida(id, comidaDTO);
        return ResponseEntity.ok(updatedComida);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComida(@PathVariable Long id, @RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        ComidaDTO existingComida = comidaService.getComidaById(id);
        if (!existingComida.getUsuarioId().equals(payload.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        comidaService.deleteComida(id);
        return ResponseEntity.noContent().build();
    }
}
