package com.aswaqbank.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.aswaqbank.entity.User;
import com.aswaqbank.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {

        System.out.println("Nom = " + user.getNom());
        System.out.println("Prenom = " + user.getPrenom());
        System.out.println("Email = " + user.getEmail());
        System.out.println("Mot de passe = " + user.getMotDePasse());

        return userService.saveUser(user);
    }
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
    
}