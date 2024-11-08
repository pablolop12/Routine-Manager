package com.pablolopezlujan.tfggimnasio.dto.User;


import com.pablolopezlujan.tfggimnasio.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserConverter {

    @Autowired
    private ModelMapper modelMapper;

    public User DTOtoUser(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    public UserDTO UserToDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTOFromRutinaDieta UserToDTOFromRutinaDieta(User user) {
        return modelMapper.map(user, UserDTOFromRutinaDieta.class);
    }

    public List<User> ListUserDTOtoUser(List<UserDTO> listDTO) {
        List<User> listUser = new ArrayList<>();
        for (UserDTO u : listDTO) {
            listUser.add(modelMapper.map(u, User.class));
        }
        return listUser;
    }

    public List<UserDTO> ListUserToUserDTO(List<User> listUser) {
        List<UserDTO> listDTO = new ArrayList<>();
        for (User u : listUser) {
            listDTO.add(modelMapper.map(u, UserDTO.class));
        }
        return listDTO;
    }

    public List<UserDTOFromRutinaDieta> ListUserToUserDTOFromRutinaDieta(List<User> listUser) {
        List<UserDTOFromRutinaDieta> listDTOFromRutinaDieta = new ArrayList<>();
        for (User u : listUser) {
            listDTOFromRutinaDieta.add(modelMapper.map(u, UserDTOFromRutinaDieta.class));
        }
        return listDTOFromRutinaDieta;
    }
}