package com.vetcare.vetapp.dto;

import java.time.LocalDate;
import java.util.UUID;

public record AdoptionHistoryPatchDTO(
        UUID animalId,
        UUID adopterId,
        LocalDate date
) {}