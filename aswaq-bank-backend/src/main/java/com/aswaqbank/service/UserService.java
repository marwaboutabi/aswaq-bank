package com.aswaqbank.service;

import java.util.List;

import com.aswaqbank.entity.User;

public interface UserService {

    User saveUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    void deleteUser(Long id);

    // =====================================================
    // PROFIL UTILISATEUR - /me
    // =====================================================

    User getCurrentUser(String email);

    User updateCurrentUser(String email, User updatedUser);
}
