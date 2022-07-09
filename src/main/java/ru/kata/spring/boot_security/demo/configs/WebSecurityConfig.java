package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserDetailsServiceImpl;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private RoleServiceImpl roleService;

    @Autowired
    private SuccessUserHandler successUserHandler;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/admin/**").hasAnyRole("ADMIN")
                .antMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .antMatchers("/userNotRole/**").not().hasAnyRole("USER", "ADMIN")
                .antMatchers("/**", "/index", "/users/**","/deleteU/**","/login/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .csrf().disable()
                .formLogin().successHandler(successUserHandler)
                .permitAll()
                .and()
                .formLogin().loginPage("/login").usernameParameter("email")
                .and()
                .logout()
                .permitAll();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

    @Bean
    GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults(""); // Remove the ROLE_ prefix
    }

//    @Bean
//    public SimpleUrlHandlerMapping customFaviconHandlerMapping() {
//        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
//        mapping.setOrder(Integer.MIN_VALUE);
//        mapping.setUrlMap(Collections.singletonMap(
//                "/favicon.ico", faviconRequestHandler()));
//        return mapping;
//    }
//
//    @Bean
//    protected ResourceHttpRequestHandler faviconRequestHandler() {
//        ResourceHttpRequestHandler requestHandler
//                = new ResourceHttpRequestHandler();
//        ClassPathResource classPathResource
//                = new ClassPathResource("/localhost/");
//        List locations = Arrays.asList(classPathResource);
//        requestHandler.setLocations(locations);
//        return requestHandler;
//    }

    @Bean
    @PostConstruct
    public void addRoles() {
        roleService.addRole(new Role(1L, "USER"));
        roleService.addRole(new Role(2L, "ADMIN"));
        User user = new User("admin@ya.ru", "admin", "Иван", "Иванов", 20, roleService.getAllRoles());
        userService.saveUser(user);
    }
}