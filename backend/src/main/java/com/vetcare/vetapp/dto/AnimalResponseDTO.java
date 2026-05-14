package com.vetcare.vetapp.dto;

import com.vetcare.vetapp.domain.AnimalStatus;
import jakarta.annotation.Nullable;

import java.util.UUID;

public record AnimalResponseDTO (
     UUID id,
     String name,
     String species,
     AnimalStatus status,
     String animalImage,
     @Nullable UUID centerId,
     @Nullable UUID ownerId
){}