package com.vetcare.vetapp.dto;

import java.time.LocalDate;
import java.util.UUID;

public record AdoptionHistoryResponseDTO(
        UUID id,
        UUID animalId,
        UUID adopterId,
        LocalDate date
) {}