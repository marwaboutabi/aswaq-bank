package com.aswaqbank.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aswaqbank.entity.User;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // =====================================================
    // RÉCUPÉRER L'UTILISATEUR CONNECTÉ
    // =====================================================

    @Override
    public User getCurrentUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur connecté introuvable")
                );
    }

    // =====================================================
    // MODIFIER L'UTILISATEUR CONNECTÉ
    // =====================================================

    @Override
    public User updateCurrentUser(String email, User updatedUser) {

        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur connecté introuvable")
                );

        // On modifie uniquement les informations du profil
        existingUser.setNom(updatedUser.getNom());
        existingUser.setPrenom(updatedUser.getPrenom());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setTelephone(updatedUser.getTelephone());

        return userRepository.save(existingUser);
    }
}
