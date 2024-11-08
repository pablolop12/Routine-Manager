package com.pablolopezlujan.tfggimnasio.controller;

import com.pablolopezlujan.tfggimnasio.dto.User.UserDTO;
import com.pablolopezlujan.tfggimnasio.entity.Role;
import com.pablolopezlujan.tfggimnasio.entity.User;
import com.pablolopezlujan.tfggimnasio.exception.errores.ExceptionCredentialNotValid;
import com.pablolopezlujan.tfggimnasio.security.dto.TokenPayloadDTO;
import com.pablolopezlujan.tfggimnasio.security.service.AuthService;
import com.pablolopezlujan.tfggimnasio.service.UserService;
import com.pablolopezlujan.tfggimnasio.dto.User.UserConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "${app.frontend.url}")
public class UserController {
    // Logs
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserConverter userConverter;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader(name = "Authorization") String token) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        logger.debug("Token Payload: " + payload.toString());
        UserDTO user = userConverter.UserToDTO(userService.findById(payload.getId()));

        if (Role.valueOf(user.getRole()) == Role.ADMIN) {
            List<User> users = userService.findAllUsers();
            List<UserDTO> usersDto = userConverter.ListUserToUserDTO(users);
            return ResponseEntity.ok(usersDto);
        } else {
            throw new ExceptionCredentialNotValid("You do not have permissions to access.");
        }
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserDTO getUserById(
            @PathVariable Long id,
            @RequestHeader(name = "Authorization") String token
    ) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        logger.debug("Token Payload: " + payload.toString());
        UserDTO user = userConverter.UserToDTO(userService.findById(payload.getId()));

        if (user.getId().equals(id) || Role.valueOf(user.getRole()) == Role.ADMIN) {
            User userBBDD = userService.findById(id);
            return userConverter.UserToDTO(userBBDD);
        } else {
            throw new ExceptionCredentialNotValid("You do not have permissions to access.");
        }
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDto) {
        User userRequest = userConverter.DTOtoUser(userDto);
        User savedUser = userService.saveUser(userRequest);
        UserDTO savedUserDto = userConverter.UserToDTO(savedUser);
        return new ResponseEntity<>(savedUserDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO userDto,
            @RequestHeader(name = "Authorization") String token
    ) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        logger.debug("Token Payload: " + payload.toString());
        UserDTO user = userConverter.UserToDTO(userService.findById(payload.getId()));
        UserDTO userToPut = userConverter.UserToDTO(userService.findById(id));
        UserDTO admin1 = userConverter.UserToDTO(userService.findById(1L));

        try {
            if ((Role.valueOf(userToPut.getRole()) != Role.ADMIN && (user.getId().equals(id) || Role.valueOf(user.getRole()) == Role.ADMIN))
                    || (Role.valueOf(userToPut.getRole()) == Role.ADMIN && (user.getId().equals(id) || user.getId().equals(1L)))) {
                User userRequest = userConverter.DTOtoUser(userDto);
                User updatedUser = userService.updateUser(id, userRequest);
                UserDTO updatedUserDto = userConverter.UserToDTO(updatedUser);
                return ResponseEntity.ok(updatedUserDto);
            } else if (Role.valueOf(userToPut.getRole()) == Role.ADMIN && (!user.getId().equals(id) || !user.getId().equals(1L))) {
                String msg = " Please contact ";
                if (!userToPut.getEmail().equals(admin1.getEmail())) {
                    msg += userToPut.getEmail();
                    msg += " or ";
                }
                msg += admin1.getEmail();
                throw new ExceptionCredentialNotValid("You do not have permissions to access to other ADMIN." + msg);
            } else {
                throw new ExceptionCredentialNotValid("You do not have permissions to access.");
            }
        } catch (Exception e) {
            logger.error("Error updating user: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(
            @PathVariable Long id,
            @RequestHeader(name = "Authorization") String token
    ) {
        TokenPayloadDTO payload = authService.getPayloadFromToken(token);
        logger.debug("Token Payload: " + payload.toString());
        UserDTO user = userConverter.UserToDTO(userService.findById(payload.getId()));
        UserDTO userToPut = userConverter.UserToDTO(userService.findById(id));
        UserDTO admin1 = userConverter.UserToDTO(userService.findById(1L));

        if (
                (Role.valueOf(userToPut.getRole()) != Role.ADMIN && (user.getId().equals(id) || Role.valueOf(user.getRole()) == Role.ADMIN))
                        || (Role.valueOf(userToPut.getRole()) == Role.ADMIN && (user.getId().equals(id) || user.getId().equals(1L)))
        ) {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else if (Role.valueOf(userToPut.getRole()) == Role.ADMIN && (!user.getId().equals(id) || !user.getId().equals(1L))) {
            String msg = " Please contact ";
            if (!userToPut.getEmail().equals(admin1.getEmail())) {
                msg += userToPut.getEmail();
                msg += " or ";
            }
            msg += admin1.getEmail();
            throw new ExceptionCredentialNotValid("You do not have permissions to access to other ADMIN." + msg);
        } else {
            throw new ExceptionCredentialNotValid("You do not have permissions to access.");
        }
    }
}
