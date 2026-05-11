package com.vetcare.vetapp.dto;

import java.util.UUID;

public record RoomPatchDTO(
        String name,
        UUID centerId
) {}