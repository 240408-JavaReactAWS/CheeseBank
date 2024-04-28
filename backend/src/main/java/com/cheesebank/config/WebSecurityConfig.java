package com.cheesebank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/login", "/api/users/register", "/api/users/reset", "/public/**").permitAll()
                        .requestMatchers("/api/users/admin/**").hasAuthority("ROLE_ADMIN")
                        .anyRequest().authenticated()
                )
//                .formLogin(form -> form
//                        .loginPage("/api/users/login")
//                        .loginProcessingUrl("/api/users/login")
//                        .defaultSuccessUrl("/api/users/profile", true)
//                        .failureUrl("/api/users/login?error=true")
//                        .permitAll()
//                )
//                .logout(logout -> logout
//                        .logoutUrl("/api/users/logout")
//                        .logoutSuccessUrl("/api/users/login?logout")
//                        .deleteCookies("JSESSIONID")
//                        .permitAll()
//                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                );

        return http.build();
    }
}
