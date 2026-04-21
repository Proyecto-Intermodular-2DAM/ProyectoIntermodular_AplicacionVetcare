package com.vetcare.vetapp.dto;

import java.util.UUID;

public record TreatmentResponseDTO(
        UUID id,
        String description,
        String medication,
        String dosage,
        UUID appointmentId,
        UUID employeeId
) {}