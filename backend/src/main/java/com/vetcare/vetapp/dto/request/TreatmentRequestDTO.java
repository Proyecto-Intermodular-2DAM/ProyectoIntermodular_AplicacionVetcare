package com.vetcare.vetapp.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record TreatmentRequestDTO(
        @NotBlank(message = "La descripción del tratamiento es obligatoria")
        String description,

        @Nullable String medication, // Puede ser nulo si no hay medicación

        @Nullable String dosage, // Puede ser nulo

        @NotNull(message = "El ID de la cita es obligatorio")
        UUID appointmentId,

        @NotNull(message = "El ID del empleado/veterinario es obligatorio")
        UUID employeeId
) {}