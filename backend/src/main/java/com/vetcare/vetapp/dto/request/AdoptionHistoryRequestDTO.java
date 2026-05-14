package com.vetcare.vetapp.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record AdoptionHistoryRequestDTO(
        @NotNull(message = "El ID del animal es obligatorio")
        UUID animalId,

        @NotNull(message = "El ID del adoptante es obligatorio")
        UUID adopterId,

        @NotNull(message = "La fecha de adopción es obligatoria")
        LocalDate date
) {}