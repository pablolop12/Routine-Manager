package com.pablolopezlujan.tfggimnasio.service.mapper;

import com.pablolopezlujan.tfggimnasio.dto.Ejercicio.EjercicioDTO;
import com.pablolopezlujan.tfggimnasio.entity.Ejercicio;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class EjercicioMapper {

    private final ModelMapper modelMapper;

    public EjercicioMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public EjercicioDTO toDTO(Ejercicio ejercicio) {
        return modelMapper.map(ejercicio, EjercicioDTO.class);
    }

    public Ejercicio toEntity(EjercicioDTO ejercicioDTO) {
        return modelMapper.map(ejercicioDTO, Ejercicio.class);
    }
}
