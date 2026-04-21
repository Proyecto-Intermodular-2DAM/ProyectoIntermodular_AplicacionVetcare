package com.vetcare.vetapp.dto;

import com.vetcare.vetapp.domain.UserRole;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record UserPatchDTO(
        String dni,
        String userName,
        String email,
        String password,
        UserRole role,
        String userImage,
        String firstName,
        String lastName,
        String phoneNumber,
        Boolean isActive,
        BigDecimal salary,
        List<UUID> workingCenterIds
) {}