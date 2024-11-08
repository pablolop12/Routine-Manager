package com.pablolopezlujan.tfggimnasio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pablolopezlujan.tfggimnasio.entity.User;
import com.pablolopezlujan.tfggimnasio.repository.UserRepository;

import com.pablolopezlujan.tfggimnasio.exception.errores.ExceptionCredentialNotValid;
import com.pablolopezlujan.tfggimnasio.exception.errores.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ResponseStatus;


@Service
public class UserService implements UserServiceInt, UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", String.valueOf(id))
                );
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("User", "id", String.valueOf(id))
        );

        // Actualiza solo los campos que se proporcionan en la solicitud
        if (user.getName() != null) {
            existingUser.setName(user.getName());
        }
        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getLastname() != null) {
            existingUser.setLastname(user.getLastname());
        }
        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
        }

        // No actualizar la contraseña si no se proporciona
        // No actualizar las rutinas y dietas, ya que no son parte de la solicitud

        return userRepository.save(existingUser);
    }



    @Override
    public User updateUserAdmin(Long id, User user) {
        User u = userRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("User", "id", String.valueOf(id))
        );
        u.setName(user.getName());
        u.setEmail(user.getEmail());
        u.setRole(user.getRole());
        u.setLastname(user.getLastname());
        u.setPassword(user.getPassword());
        u.setRutinas(user.getRutinas());
        u.setDietas(user.getDietas());
        return userRepository.save(u);
    }

    @ResponseStatus(HttpStatus.OK)
    @Override
    public User deleteUser(Long id) {
        User u = userRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("User", "id", String.valueOf(id))
        );
        userRepository.deleteById(id);
        return u;
    }

    // INTERFAZ UserDetailsService

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ExceptionCredentialNotValid("Usuario no encontrado con email: " + email));
    }
}
