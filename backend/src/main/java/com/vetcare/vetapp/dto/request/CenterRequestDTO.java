package com.vetcare.vetapp.dto.request;

import com.vetcare.vetapp.domain.CenterType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CenterRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        String name,

        @NotBlank(message = "La dirección es obligatoria")
        String address,

        @NotBlank(message = "La ciudad es obligatoria")
        String city,

        @NotBlank(message = "El código postal es obligatorio")
        String postcode,

        @NotNull(message = "El tipo de centro es obligatorio")
        CenterType type
) {}