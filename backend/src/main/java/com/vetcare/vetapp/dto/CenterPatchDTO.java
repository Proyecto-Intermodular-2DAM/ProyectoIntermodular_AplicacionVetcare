package com.vetcare.vetapp.dto;

import com.vetcare.vetapp.domain.CenterType;

public record CenterPatchDTO(
        String name,
        String address,
        String city,
        String postcode,
        CenterType type
) {}