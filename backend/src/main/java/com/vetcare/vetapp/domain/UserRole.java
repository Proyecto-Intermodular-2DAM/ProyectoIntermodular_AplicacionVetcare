package com.vetcare.vetapp.domain;

public enum UserRole {
    ADMIN, 
    CLIENT, 
    VETERINARIAN, 
    RECEPTIONIST, 
    CAREGIVER, 
    SURGEON,
    VETERINARIAN_SURGEON,      // Veterinario que también es cirujano
    VETERINARIAN_CAREGIVER     // Veterinario que también es cuidador
}
