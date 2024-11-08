package com.pablolopezlujan.tfggimnasio.service;

import java.util.List;

import com.pablolopezlujan.tfggimnasio.entity.User;


public interface UserServiceInt {
    List<User> findAllUsers();
    User findById(Long id);
    User saveUser(User user);
    User updateUser(Long id, User user);
    User updateUserAdmin(Long id, User user);
    User deleteUser(Long id);
}