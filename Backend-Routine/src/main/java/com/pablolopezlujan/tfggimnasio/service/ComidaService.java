package com.pablolopezlujan.tfggimnasio.service;

import com.pablolopezlujan.tfggimnasio.dto.Comida.ComidaDTO;
import com.pablolopezlujan.tfggimnasio.entity.Comida;
import com.pablolopezlujan.tfggimnasio.repository.ComidaRepository;
import com.pablolopezlujan.tfggimnasio.service.mapper.ComidaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComidaService {

    @Autowired
    private ComidaRepository comidaRepository;

    @Autowired
    private ComidaMapper comidaMapper;

    public ComidaDTO createComida(ComidaDTO comidaDTO) {
        Comida comida = comidaMapper.toEntity(comidaDTO);
        Comida savedComida = comidaRepository.save(comida);
        return comidaMapper.toDTO(savedComida);
    }

    public ComidaDTO getComidaById(Long id) {
        Comida comida = comidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comida not found"));
        return comidaMapper.toDTO(comida);
    }

    public List<ComidaDTO> getAllComidas() {
        List<Comida> comidas = comidaRepository.findAll();
        return comidas.stream().map(comidaMapper::toDTO).collect(Collectors.toList());
    }

    public ComidaDTO updateComida(Long id, ComidaDTO comidaDTO) {
        Comida comida = comidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comida not found"));
        comida.setTipoComida(comidaDTO.getTipoComida());
        comida.setNombre(comidaDTO.getNombre());
        comida.setDescripcion(comidaDTO.getDescripcion());
        comida.setCalorias(comidaDTO.getCalorias());
        comida.setImagenUrl(comidaDTO.getImagenUrl());
        Comida updatedComida = comidaRepository.save(comida);
        return comidaMapper.toDTO(updatedComida);
    }

    public void deleteComida(Long id) {
        comidaRepository.deleteById(id);
    }
}
