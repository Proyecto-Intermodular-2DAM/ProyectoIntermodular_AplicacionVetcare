package com.vetcare.vetapp.dto.request;

import com.vetcare.vetapp.domain.AppointmentStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentRequestDTO(
        @NotNull(message = "La fecha es obligatoria")
        LocalDate date,

        @NotNull(message = "La hora es obligatoria")
        LocalTime time,

        @NotBlank(message = "El motivo es obligatorio")
        String reason,

        @NotNull(message = "El estado es obligatorio")
        AppointmentStatus status,

        UUID receptionistId, // Puede ser nulo

        @NotNull(message = "El ID del cliente es obligatorio")
        UUID clientId,

        @NotNull(message = "El ID del animal es obligatorio")
        UUID animalId,

        @Nullable UUID roomId
) {}