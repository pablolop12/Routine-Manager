package com.pablolopezlujan.tfggimnasio.service.mapper;

import com.pablolopezlujan.tfggimnasio.dto.Comida.ComidaDTO;
import com.pablolopezlujan.tfggimnasio.entity.Comida;
import com.pablolopezlujan.tfggimnasio.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class ComidaMapper {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public ComidaMapper(ModelMapper modelMapper, UserRepository userRepository) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    public ComidaDTO toDTO(Comida comida) {
        ComidaDTO comidaDTO = modelMapper.map(comida, ComidaDTO.class);
        comidaDTO.setUsuarioId(comida.getUsuario().getId());
        return comidaDTO;
    }

    public Comida toEntity(ComidaDTO comidaDTO) {
        Comida comida = modelMapper.map(comidaDTO, Comida.class);
        comida.setUsuario(userRepository.findById(comidaDTO.getUsuarioId()).orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
        return comida;
    }
}
