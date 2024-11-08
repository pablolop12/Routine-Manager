package com.pablolopezlujan.tfggimnasio.service;

import com.pablolopezlujan.tfggimnasio.dto.Dieta.DietaDTO;
import com.pablolopezlujan.tfggimnasio.dto.DietaComida.DietaComidaDTO;
import com.pablolopezlujan.tfggimnasio.entity.Comida;
import com.pablolopezlujan.tfggimnasio.entity.Dieta;
import com.pablolopezlujan.tfggimnasio.entity.DietaComida;
import com.pablolopezlujan.tfggimnasio.entity.User;
import com.pablolopezlujan.tfggimnasio.repository.ComidaRepository;
import com.pablolopezlujan.tfggimnasio.repository.DietaComidaRepository;
import com.pablolopezlujan.tfggimnasio.repository.DietaRepository;
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
public class DietaService {

    private static final Logger logger = LoggerFactory.getLogger(DietaService.class);

    private final DietaRepository dietaRepository;
    private final DietaComidaRepository dietaComidaRepository;
    private final ComidaRepository comidaRepository;
    private final UserRepository userRepository;

    public DietaDTO createDieta(DietaDTO dietaDTO) {
        User user = userRepository.findById(dietaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Dieta dieta = Dieta.builder()
                .nombreDieta(dietaDTO.getNombreDieta())
                .descripcion(dietaDTO.getDescripcion())
                .isActive(dietaDTO.isActive())
                .startDate(dietaDTO.getStartDate()) // Este campo debe estar presente en DietaDTO
                .usuario(user)
                .build();

        // Desactivar otras dietas del usuario si esta es activa
        if (dietaDTO.isActive()) {
            dietaRepository.findActiveDietaByUserId(user.getId()).ifPresent(existingDieta -> {
                existingDieta.setActive(false);
                dietaRepository.save(existingDieta);
            });
        }

        List<DietaComida> dietaComidas = new ArrayList<>();
        for (DietaComidaDTO dietaComidaDTO : dietaDTO.getDietaComidas()) {
            Comida comida = comidaRepository.findById(dietaComidaDTO.getComidaId())
                    .orElseThrow(() -> new RuntimeException("Comida no encontrada"));

            DietaComida dietaComida = DietaComida.builder()
                    .dieta(dieta)
                    .comida(comida)
                    .dia(dietaComidaDTO.getDia())
                    .nombreDia(dietaComidaDTO.getNombreDia())
                    .tipoComida(dietaComidaDTO.getTipoComida())
                    .cantidad(dietaComidaDTO.getCantidad())
                    .build();

            dietaComidas.add(dietaComida);
        }

        dieta.setDietaComidas(dietaComidas);
        dietaRepository.save(dieta);
        dietaComidaRepository.saveAll(dietaComidas);

        dietaDTO.setId(dieta.getId());
        return dietaDTO;
    }

    public List<DietaDTO> getDietasByUserId(Long userId) {
        List<Dieta> dietas = dietaRepository.findByUsuarioId(userId);
        return dietas.stream()
                .map(dieta -> new DietaDTO(dieta))
                .collect(Collectors.toList());
    }

    public void activateDieta(Long dietaId, Long userId) {
        Dieta dieta = dietaRepository.findById(dietaId)
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));

        // Desactivar otras dietas del usuario
        dietaRepository.findActiveDietaByUserId(userId).ifPresent(existingDieta -> {
            existingDieta.setActive(false);
            dietaRepository.save(existingDieta);
        });

        // Activar la dieta seleccionada
        dieta.setActive(true);
        dietaRepository.save(dieta);
    }

    public void deleteDieta(Long dietaId) {
        dietaRepository.deleteById(dietaId);
    }

    public DietaDTO updateDieta(Long id, DietaDTO dietaDTO) {
        logger.info("Actualizando dieta con ID: {}", id);

        try {
            // Buscar la dieta existente
            Dieta dieta = dietaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));

            // Actualizar los detalles de la dieta
            dieta.setNombreDieta(dietaDTO.getNombreDieta());
            dieta.setDescripcion(dietaDTO.getDescripcion());
            dieta.setActive(dietaDTO.isActive());
            dieta.setStartDate(dietaDTO.getStartDate()); // Este campo debe estar presente en DietaDTO

            // Map para realizar seguimiento de las comidas existentes
            Map<Long, DietaComida> existingComidasMap = dieta.getDietaComidas().stream()
                    .collect(Collectors.toMap(DietaComida::getId, e -> e));

            List<DietaComida> updatedDietaComidas = new ArrayList<>();

            for (DietaComidaDTO dietaComidaDTO : dietaDTO.getDietaComidas()) {
                Comida comida = comidaRepository.findById(dietaComidaDTO.getComidaId())
                        .orElseThrow(() -> new RuntimeException("Comida no encontrada"));

                DietaComida dietaComida;
                if (dietaComidaDTO.getId() != null && existingComidasMap.containsKey(dietaComidaDTO.getId())) {
                    // Actualizar la comida existente
                    dietaComida = existingComidasMap.get(dietaComidaDTO.getId());
                    dietaComida.setComida(comida); // Asegurarse de que la comida se actualice
                    dietaComida.setDia(dietaComidaDTO.getDia());
                    dietaComida.setNombreDia(dietaComidaDTO.getNombreDia());
                    dietaComida.setTipoComida(dietaComidaDTO.getTipoComida());
                    dietaComida.setCantidad(dietaComidaDTO.getCantidad());
                } else {
                    // Crear una nueva comida
                    dietaComida = DietaComida.builder()
                            .dieta(dieta)
                            .comida(comida)
                            .dia(dietaComidaDTO.getDia())
                            .nombreDia(dietaComidaDTO.getNombreDia())
                            .tipoComida(dietaComidaDTO.getTipoComida())
                            .cantidad(dietaComidaDTO.getCantidad())
                            .build();
                    dietaComidaRepository.save(dietaComida); // Guardar la nueva comida
                }

                updatedDietaComidas.add(dietaComida);
            }

            // Eliminar comidas que no están en la lista actualizada
            List<DietaComida> comidasAEliminar = dieta.getDietaComidas().stream()
                    .filter(comida -> !updatedDietaComidas.contains(comida))
                    .collect(Collectors.toList());
            dietaComidaRepository.deleteAll(comidasAEliminar);

            dieta.getDietaComidas().clear();
            dieta.getDietaComidas().addAll(updatedDietaComidas);

            dietaRepository.save(dieta);

            return new DietaDTO(dieta);
        } catch (Exception e) {
            logger.error("Error actualizando la dieta: {}", e.getMessage(), e);
            throw e;
        }
    }

    public DietaDTO getDietaById(Long id) {
        Dieta dieta = dietaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));
        return new DietaDTO(dieta);
    }

    public DietaDTO getActiveDietaByUserId(Long userId) {
        Dieta dieta = dietaRepository.findActiveDietaByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Dieta activa no encontrada"));
        return new DietaDTO(dieta);
    }
}
