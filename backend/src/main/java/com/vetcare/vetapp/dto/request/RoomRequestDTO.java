package com.vetcare.vetapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RoomRequestDTO(
        @NotBlank(message = "El nombre de la sala es obligatorio")
        String name,

        @NotNull(message = "El ID del centro es obligatorio")
        UUID centerId
) {}