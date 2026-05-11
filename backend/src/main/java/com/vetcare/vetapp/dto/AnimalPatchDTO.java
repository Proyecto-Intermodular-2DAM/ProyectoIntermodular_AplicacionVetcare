package com.vetcare.vetapp.dto;

import com.vetcare.vetapp.domain.AnimalStatus;
import java.util.UUID;

public record AnimalPatchDTO(
     String name,
     String species,
     AnimalStatus status,
     String animalImage,
     UUID ownerId,
     UUID centerId
){}