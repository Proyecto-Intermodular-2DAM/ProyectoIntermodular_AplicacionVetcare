package com.vetcare.vetapp.dto;

import com.vetcare.vetapp.domain.UserRole;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

// no se incluye la contraseña en el DTO de respuesta por seguridad
public record UserResponseDTO(
        UUID id,
        String dni,
        String userName,
        String email,
        UserRole role,
        String userImage,
        String firstName,
        String lastName,
        String phoneNumber,
        boolean isActive,
        BigDecimal salary,
        List<UUID> workingCenterIds
) {}