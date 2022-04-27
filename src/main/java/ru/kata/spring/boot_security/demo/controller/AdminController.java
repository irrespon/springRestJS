package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.MyUserDetailsService;

@Controller
public class AdminController {
    private final MyUserDetailsService userService;

    public AdminController(MyUserDetailsService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String userList(Model model) {
        model.addAttribute("users", userService.allUsers());
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
        model.addAttribute("allRoles",userService.getAllRoles());
        return "editPage";
    }

    @PostMapping()
    public String updateUser (@ModelAttribute ("user") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PutMapping("/edit/{id}")
    public String createUser (@ModelAttribute ("user") User user) {
        userService.edit(user);
        return "redirect:/admin";
    }

    @GetMapping("/newUser")
    public String newUser (Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("allRoles",userService.getAllRoles());
        return "newUser";
    }

    @GetMapping("/user")
    public String infoUser(){
        return "/user";
    }

    @GetMapping("/userNotRole")
    public String infoUserNotRole(){
        return "userNotRole";
    }
}
