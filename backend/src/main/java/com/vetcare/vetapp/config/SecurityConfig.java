package com.vetcare.vetapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security configuration for the Vetcare backend.
 * Configures OAuth2 Resource Server to validate JWT tokens from Keycloak.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enables @PreAuthorize annotations
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // CSRF disabled (stateless API with JWT)
            .csrf(csrf -> csrf.disable())
            
            // Session management (stateless)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints (health check, etc.)
                .requestMatchers("/actuator/**", "/actuator/health").permitAll()
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            
            // OAuth2 Resource Server (JWT validation)
            .oauth2ResourceServer(oauth2 -> 
                oauth2.jwt(jwt -> {
                    // JWT configuration is loaded from application.properties
                    // spring.security.oauth2.resourceserver.jwt.issuer-uri
                })
            );

        return http.build();
    }

    /**
     * CORS configuration to allow requests from frontend applications.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allowed origins (frontend URLs)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",      // React dev server
            "https://localhost",           // Nginx dev
            "https://vetcare.US.KG"        // Production
        ));
        
        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Allowed headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Apply CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
