package com.vetcare.vetapp.dto.request;

import com.vetcare.vetapp.domain.AnimalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AnimalRequestDTO (
    @NotBlank String name,
    @NotBlank String species,
    @NotNull AnimalStatus status,
    String animalImage,
    UUID ownerId,
    UUID centerId
){}
