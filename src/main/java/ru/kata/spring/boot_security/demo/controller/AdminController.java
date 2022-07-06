package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import java.util.List;

@Controller
@CrossOrigin(origins = {"http://localhost:8080"})
public class AdminController {
    private final UserServiceImpl userService;

    private final RoleServiceImpl roleService;

    private boolean resultEditUser;

    public AdminController(UserServiceImpl userService, RoleServiceImpl roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public String userList(Model model) {
        model.addAttribute("users", userService.allUsers());
        model.addAttribute("user", new User());
        model.addAttribute("allRoles", roleService.getAllRoles());
        model.addAttribute("alarm", resultEditUser);
        return "admin";
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @GetMapping("/edit/{id}")
    public String editPage(@PathVariable("id") Long id, Model model) {
        User user = userService.findUserById(id);
        model.addAttribute(user);
        model.addAttribute("allRoles", roleService.getAllRoles());
        return "editPage";
    }

    @PostMapping()
    public String createUser(@ModelAttribute("user") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PutMapping("/edit/{id}")
    public String updateUser(@ModelAttribute("user") User user) {
        resultEditUser = !userService.edit(user);
        return "redirect:/admin";
    }

    @GetMapping("/newUser")
    public String newUser(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("allRoles", roleService.getAllRoles());
        return "newUser";
    }

    @GetMapping("/user")
    public String infoUser() {
        return "/user";
    }

    @GetMapping("/userNotRole")
    public String infoUserNotRole() {
        return "userNotRole";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }


}
