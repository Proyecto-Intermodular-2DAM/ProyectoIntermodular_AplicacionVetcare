package com.vetcare.vetapp.service;

import com.vetcare.vetapp.domain.Center;
import com.vetcare.vetapp.domain.User;
import com.vetcare.vetapp.domain.UserRole;
import com.vetcare.vetapp.dto.UserPatchDTO;
import com.vetcare.vetapp.dto.UserResponseDTO;
import com.vetcare.vetapp.dto.request.UserRequestDTO;
import com.vetcare.vetapp.repository.CenterRepository;
import com.vetcare.vetapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CenterRepository centerRepository;

    public List<UserResponseDTO> getUsers(String email, String dni, UserRole role) {
        if (email != null) {
            return userRepository.findByEmail(email)
                    .map(user -> List.of(mapToResponse(user)))
                    .orElse(List.of());
        } else if (dni != null) {
            return userRepository.findByDni(dni)
                    .map(user -> List.of(mapToResponse(user)))
                    .orElse(List.of());
        } else if (role != null) {
            return userRepository.findByRole(role).stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UserResponseDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
        return mapToResponse(user);
    }

    public UserResponseDTO createUser(UserRequestDTO requestDTO) {
        User user = new User();
        updateEntityFromRequest(user, requestDTO);
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public UserResponseDTO updateUser(UUID id, UserRequestDTO requestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        updateEntityFromRequest(user, requestDTO);
        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public UserResponseDTO patchUser(UUID id, UserPatchDTO patchDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        if (patchDTO.dni() != null) user.setDni(patchDTO.dni());
        if (patchDTO.userName() != null) user.setUserName(patchDTO.userName());
        if (patchDTO.email() != null) user.setEmail(patchDTO.email());
        if (patchDTO.password() != null) user.setPassword(patchDTO.password());
        if (patchDTO.role() != null) user.setRole(patchDTO.role());
        if (patchDTO.userImage() != null) user.setUserImage(patchDTO.userImage());
        if (patchDTO.firstName() != null) user.setFirstName(patchDTO.firstName());
        if (patchDTO.lastName() != null) user.setLastName(patchDTO.lastName());
        if (patchDTO.phoneNumber() != null) user.setPhoneNumber(patchDTO.phoneNumber());
        if (patchDTO.isActive() != null) user.setActive(patchDTO.isActive());
        if (patchDTO.salary() != null) user.setSalary(patchDTO.salary());

        if (patchDTO.workingCenterIds() != null) {
            user.setWorkingCenters(getCentersFromIds(patchDTO.workingCenterIds()));
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado con id: " + id);
        }
        userRepository.deleteById(id);
    }

    // --- Métodos Privados ---

    private void updateEntityFromRequest(User user, UserRequestDTO dto) {
        user.setDni(dto.dni());
        user.setUserName(dto.userName());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setRole(dto.role());
        user.setUserImage(dto.userImage());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPhoneNumber(dto.phoneNumber());
        user.setActive(dto.isActive());
        user.setSalary(dto.salary());

        user.setWorkingCenters(getCentersFromIds(dto.workingCenterIds()));
    }

    private List<Center> getCentersFromIds(List<UUID> centerIds) {
        if (centerIds == null || centerIds.isEmpty()) {
            return new ArrayList<>();
        }
        return centerIds.stream()
                .map(id -> centerRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Centro no encontrado con id: " + id)))
                .toList();
    }

    private UserResponseDTO mapToResponse(User user) {
        List<UUID> centerIds = new ArrayList<>();
        if (user.getWorkingCenters() != null) {
            centerIds = user.getWorkingCenters().stream()
                    .map(Center::getId)
                    .toList();
        }

        return new UserResponseDTO(
                user.getId(),
                user.getDni(),
                user.getUserName(),
                user.getEmail(),
                user.getRole(),
                user.getUserImage(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.isActive(),
                user.getSalary(),
                centerIds
        );
    }
}