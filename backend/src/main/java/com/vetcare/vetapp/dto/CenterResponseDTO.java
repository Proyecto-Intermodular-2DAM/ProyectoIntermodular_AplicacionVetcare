package com.vetcare.vetapp.dto;

import com.vetcare.vetapp.domain.CenterType;
import java.util.UUID;

public record CenterResponseDTO(
        UUID id,
        String name,
        String address,
        String city,
        String postcode,
        CenterType type
) {}