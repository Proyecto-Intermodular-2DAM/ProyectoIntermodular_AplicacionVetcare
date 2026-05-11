package com.vetcare.vetapp.dto;

import com.vetcare.vetapp.domain.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentPatchDTO(
        LocalDate date,
        LocalTime time,
        String reason,
        AppointmentStatus status,
        UUID receptionistId,
        UUID clientId,
        UUID animalId,
        UUID roomId
) {}