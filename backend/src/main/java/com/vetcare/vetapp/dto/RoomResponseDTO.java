package com.vetcare.vetapp.dto;

import java.util.UUID;

public record RoomResponseDTO(
        UUID id,
        String name,
        UUID centerId
) {}