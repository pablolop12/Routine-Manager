package com.pablolopezlujan.tfggimnasio.service;

import com.pablolopezlujan.tfggimnasio.dto.Ejercicio.EjercicioDTO;
import com.pablolopezlujan.tfggimnasio.entity.Ejercicio;
import com.pablolopezlujan.tfggimnasio.repository.EjercicioRepository;
import com.pablolopezlujan.tfggimnasio.service.mapper.EjercicioMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EjercicioService {

    @Autowired
    private EjercicioRepository ejercicioRepository;

    @Autowired
    private EjercicioMapper ejercicioMapper;

    public EjercicioDTO createEjercicio(EjercicioDTO ejercicioDTO) {
        Ejercicio ejercicio = ejercicioMapper.toEntity(ejercicioDTO);
        Ejercicio savedEjercicio = ejercicioRepository.save(ejercicio);
        return ejercicioMapper.toDTO(savedEjercicio);
    }

    public EjercicioDTO getEjercicioById(Long id) {
        Ejercicio ejercicio = ejercicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ejercicio not found"));
        return ejercicioMapper.toDTO(ejercicio);
    }

    public List<EjercicioDTO> getAllEjercicios() {
        List<Ejercicio> ejercicios = ejercicioRepository.findAll();
        return ejercicios.stream().map(ejercicioMapper::toDTO).collect(Collectors.toList());
    }

    public EjercicioDTO updateEjercicio(Long id, EjercicioDTO ejercicioDTO) {
        Ejercicio ejercicio = ejercicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ejercicio not found"));
        ejercicio.setNombre(ejercicioDTO.getNombre());
        ejercicio.setDescripcion(ejercicioDTO.getDescripcion());
        ejercicio.setCategoria(ejercicioDTO.getCategoria());
        ejercicio.setImagenUrl(ejercicioDTO.getImagenUrl());
        Ejercicio updatedEjercicio = ejercicioRepository.save(ejercicio);
        return ejercicioMapper.toDTO(updatedEjercicio);
    }

    public void deleteEjercicio(Long id) {
        ejercicioRepository.deleteById(id);
    }
}
