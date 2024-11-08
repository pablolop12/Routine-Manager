package com.pablolopezlujan.tfggimnasio.service;

import com.pablolopezlujan.tfggimnasio.dto.Rutina.RutinaDTO;
import com.pablolopezlujan.tfggimnasio.dto.RutinaEjercicio.RutinaEjercicioDTO;
import com.pablolopezlujan.tfggimnasio.entity.Ejercicio;
import com.pablolopezlujan.tfggimnasio.entity.Rutina;
import com.pablolopezlujan.tfggimnasio.entity.RutinaEjercicio;
import com.pablolopezlujan.tfggimnasio.entity.User;
import com.pablolopezlujan.tfggimnasio.repository.EjercicioRepository;
import com.pablolopezlujan.tfggimnasio.repository.RutinaEjercicioRepository;
import com.pablolopezlujan.tfggimnasio.repository.RutinaRepository;
import com.pablolopezlujan.tfggimnasio.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RutinaService {

    private static final Logger logger = LoggerFactory.getLogger(RutinaService.class);

    private final RutinaRepository rutinaRepository;
    private final RutinaEjercicioRepository rutinaEjercicioRepository;
    private final EjercicioRepository ejercicioRepository;
    private final UserRepository userRepository;

    public RutinaDTO createRutina(RutinaDTO rutinaDTO) {
        User user = userRepository.findById(rutinaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Rutina rutina = Rutina.builder()
                .nombreRutina(rutinaDTO.getNombreRutina())
                .descripcion(rutinaDTO.getDescripcion())
                .isActive(rutinaDTO.isActive())
                .startDate(rutinaDTO.getStartDate())
                .usuario(user)
                .build();

        // Desactivar otras rutinas del usuario si esta es activa
        if (rutinaDTO.isActive()) {
            rutinaRepository.findActiveRutinaByUserId(user.getId()).ifPresent(existingRutina -> {
                existingRutina.setActive(false);
                rutinaRepository.save(existingRutina);
            });
        }

        List<RutinaEjercicio> rutinaEjercicios = new ArrayList<>();
        for (RutinaEjercicioDTO rutinaEjercicioDTO : rutinaDTO.getRutinaEjercicios()) {
            Ejercicio ejercicio = ejercicioRepository.findById(rutinaEjercicioDTO.getEjercicioId())
                    .orElseThrow(() -> new RuntimeException("Ejercicio no encontrado"));

            RutinaEjercicio rutinaEjercicio = RutinaEjercicio.builder()
                    .rutina(rutina)
                    .ejercicio(ejercicio)
                    .dia(rutinaEjercicioDTO.getDia())
                    .nombreDia(rutinaEjercicioDTO.getNombreDia())
                    .repeticiones(rutinaEjercicioDTO.getRepeticiones())
                    .series(rutinaEjercicioDTO.getSeries())
                    .peso(rutinaEjercicioDTO.getPeso())
                    .build();

            rutinaEjercicios.add(rutinaEjercicio);
        }

        rutina.setRutinaEjercicios(rutinaEjercicios);
        rutinaRepository.save(rutina);
        rutinaEjercicioRepository.saveAll(rutinaEjercicios);

        rutinaDTO.setId(rutina.getId());
        return rutinaDTO;
    }

    public List<RutinaDTO> getRutinasByUserId(Long userId) {
        List<Rutina> rutinas = rutinaRepository.findByUsuarioId(userId);
        return rutinas.stream()
                .map(rutina -> new RutinaDTO(rutina))
                .collect(Collectors.toList());
    }

    public void activateRutina(Long rutinaId, Long userId) {
        Rutina rutina = rutinaRepository.findById(rutinaId)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        // Desactivar otras rutinas del usuario
        rutinaRepository.findActiveRutinaByUserId(userId).ifPresent(existingRutina -> {
            existingRutina.setActive(false);
            rutinaRepository.save(existingRutina);
        });

        // Activar la rutina seleccionada
        rutina.setActive(true);
        rutinaRepository.save(rutina);
    }

    public void deleteRutina(Long rutinaId) {
        rutinaRepository.deleteById(rutinaId);
    }

    public RutinaDTO updateRutina(Long id, RutinaDTO rutinaDTO) {
        logger.info("Actualizando rutina con ID: {}", id);

        try {
            // Buscar la rutina existente
            Rutina rutina = rutinaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

            // Actualizar los detalles de la rutina
            rutina.setNombreRutina(rutinaDTO.getNombreRutina());
            rutina.setDescripcion(rutinaDTO.getDescripcion());
            rutina.setActive(rutinaDTO.isActive());
            rutina.setStartDate(rutinaDTO.getStartDate());

            // Map para realizar seguimiento de los ejercicios existentes
            Map<Long, RutinaEjercicio> existingEjerciciosMap = rutina.getRutinaEjercicios().stream()
                    .collect(Collectors.toMap(RutinaEjercicio::getId, e -> e));

            List<RutinaEjercicio> updatedRutinaEjercicios = new ArrayList<>();

            for (RutinaEjercicioDTO rutinaEjercicioDTO : rutinaDTO.getRutinaEjercicios()) {
                Ejercicio ejercicio = ejercicioRepository.findById(rutinaEjercicioDTO.getEjercicioId())
                        .orElseThrow(() -> new RuntimeException("Ejercicio no encontrado"));

                RutinaEjercicio rutinaEjercicio;
                if (rutinaEjercicioDTO.getId() != null && existingEjerciciosMap.containsKey(rutinaEjercicioDTO.getId())) {
                    // Actualizar el ejercicio existente
                    rutinaEjercicio = existingEjerciciosMap.get(rutinaEjercicioDTO.getId());
                    rutinaEjercicio.setEjercicio(ejercicio); // Asegurarse de que el ejercicio se actualice
                    rutinaEjercicio.setDia(rutinaEjercicioDTO.getDia());
                    rutinaEjercicio.setNombreDia(rutinaEjercicioDTO.getNombreDia());
                    rutinaEjercicio.setRepeticiones(rutinaEjercicioDTO.getRepeticiones());
                    rutinaEjercicio.setSeries(rutinaEjercicioDTO.getSeries());
                    rutinaEjercicio.setPeso(rutinaEjercicioDTO.getPeso());
                } else {
                    // Crear un nuevo ejercicio
                    rutinaEjercicio = RutinaEjercicio.builder()
                            .rutina(rutina)
                            .ejercicio(ejercicio)
                            .dia(rutinaEjercicioDTO.getDia())
                            .nombreDia(rutinaEjercicioDTO.getNombreDia())
                            .repeticiones(rutinaEjercicioDTO.getRepeticiones())
                            .series(rutinaEjercicioDTO.getSeries())
                            .peso(rutinaEjercicioDTO.getPeso())
                            .build();
                    rutinaEjercicioRepository.save(rutinaEjercicio); // Guardar el nuevo ejercicio
                }

                updatedRutinaEjercicios.add(rutinaEjercicio);
            }

            // Eliminar ejercicios que no están en la lista actualizada
            List<RutinaEjercicio> ejerciciosAEliminar = rutina.getRutinaEjercicios().stream()
                    .filter(ejercicio -> !updatedRutinaEjercicios.contains(ejercicio))
                    .collect(Collectors.toList());
            rutinaEjercicioRepository.deleteAll(ejerciciosAEliminar);

            rutina.getRutinaEjercicios().clear();
            rutina.getRutinaEjercicios().addAll(updatedRutinaEjercicios);

            rutinaRepository.save(rutina);

            return new RutinaDTO(rutina);
        } catch (Exception e) {
            logger.error("Error actualizando la rutina: {}", e.getMessage(), e);
            throw e;
        }
    }

    public RutinaDTO getRutinaById(Long id) {
        Rutina rutina = rutinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        return new RutinaDTO(rutina);
    }

    public RutinaDTO getActiveRutinaByUserId(Long userId) {
        Rutina rutina = rutinaRepository.findActiveRutinaByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Rutina activa no encontrada"));
        return new RutinaDTO(rutina);
    }
}
