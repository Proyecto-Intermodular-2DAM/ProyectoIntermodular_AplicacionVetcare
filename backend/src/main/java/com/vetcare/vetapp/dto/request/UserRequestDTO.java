package com.vetcare.vetapp.dto.request;

import com.vetcare.vetapp.domain.UserRole;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record UserRequestDTO(
        @NotBlank(message = "El DNI es obligatorio")
        @Size(max = 9)
        String dni,

        @NotBlank(message = "El nombre de usuario es obligatorio")
        String userName,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Debe ser un email válido")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        String password,

        @NotNull(message = "El rol es obligatorio")
        UserRole role,

        String userImage,

        @NotBlank(message = "El nombre es obligatorio")
        String firstName,

        @NotBlank(message = "El apellido es obligatorio")
        String lastName,

        @NotBlank(message = "El teléfono es obligatorio")
        String phoneNumber,

        @NotNull(message = "El estado de actividad es obligatorio")
        Boolean isActive,

        BigDecimal salary,

        // Lista de IDs de los centros donde trabaja (puede ser nula o vacía para clientes)
        @Nullable List<UUID> workingCenterIds
) {}