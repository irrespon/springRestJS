package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@CrossOrigin(origins = {"http://localhost:8080"})
public class RestControllerJS {

    @Autowired
    UserService userService;

    @Autowired
    RoleService roleService;

    @GetMapping(value = "/users")
    public ResponseEntity<List<User>> allUsers(){
        List<User> users = userService.allUsers();
        return new ResponseEntity<List<User>>(users,HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public User userID(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        return user;
    }

    @GetMapping("/allRoles")
    public Set<Role> getAllRoles() {
         return roleService.getAllRoles();
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @PutMapping("/users")
    public User updateUser(@RequestBody User user) {
        userService.edit(user);
        return user;
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        userService.deleteUser(id);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @GetMapping("/loginUser")
    public Object getUser() {
       Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getPrincipal();
    }

    @GetMapping("/statusUser")
    public boolean getStatusUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null) {
            return true;
        }
        return false;
    }
}
