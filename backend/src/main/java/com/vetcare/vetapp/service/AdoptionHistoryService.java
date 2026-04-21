package com.vetcare.vetapp.service;

import com.vetcare.vetapp.domain.AdoptionHistory;
import com.vetcare.vetapp.domain.Animal;
import com.vetcare.vetapp.domain.User;
import com.vetcare.vetapp.dto.AdoptionHistoryPatchDTO;
import com.vetcare.vetapp.dto.request.AdoptionHistoryRequestDTO;
import com.vetcare.vetapp.dto.AdoptionHistoryResponseDTO;
import com.vetcare.vetapp.repository.AdoptionHistoryRepository;
import com.vetcare.vetapp.repository.AnimalRepository;
import com.vetcare.vetapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdoptionHistoryService {

    private final AdoptionHistoryRepository adoptionHistoryRepository;
    private final AnimalRepository animalRepository;
    private final UserRepository userRepository;

    public AdoptionHistoryResponseDTO getAdoptionHistoryById(UUID id) {
        AdoptionHistory adoption = adoptionHistoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Historial de adopción no encontrado con id: " + id));
        return mapToResponse(adoption);
    }

    public List<AdoptionHistoryResponseDTO> getAdoptionsByUserId(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new jakarta.persistence.EntityNotFoundException("Usuario no encontrado con id: " + userId);
        }

        List<AdoptionHistory> adoptions = adoptionHistoryRepository.findAdoptionHistoriesByAdopterId(userId);

        return adoptions.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AdoptionHistoryResponseDTO createAdoptionHistory(AdoptionHistoryRequestDTO requestDTO) {
        AdoptionHistory adoption = new AdoptionHistory();
        updateEntityFromRequest(adoption, requestDTO);
        AdoptionHistory savedAdoption = adoptionHistoryRepository.save(adoption);
        return mapToResponse(savedAdoption);
    }

    public AdoptionHistoryResponseDTO updateAdoptionHistory(UUID id, AdoptionHistoryRequestDTO requestDTO) {
        AdoptionHistory adoption = adoptionHistoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Historial de adopción no encontrado con id: " + id));

        updateEntityFromRequest(adoption, requestDTO);
        AdoptionHistory updatedAdoption = adoptionHistoryRepository.save(adoption);
        return mapToResponse(updatedAdoption);
    }

    public AdoptionHistoryResponseDTO patchAdoptionHistory(UUID id, AdoptionHistoryPatchDTO patchDTO) {
        AdoptionHistory adoption = adoptionHistoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Historial de adopción no encontrado con id: " + id));

        if (patchDTO.date() != null) {
            adoption.setDate(patchDTO.date());
        }

        if (patchDTO.animalId() != null) {
            Animal animal = animalRepository.findById(patchDTO.animalId())
                    .orElseThrow(() -> new EntityNotFoundException("Animal no encontrado"));
            adoption.setAnimal(animal);
        }

        if (patchDTO.adopterId() != null) {
            User adopter = userRepository.findById(patchDTO.adopterId())
                    .orElseThrow(() -> new EntityNotFoundException("Adoptante (User) no encontrado"));
            adoption.setAdopter(adopter);
        }

        AdoptionHistory updatedAdoption = adoptionHistoryRepository.save(adoption);
        return mapToResponse(updatedAdoption);
    }

    public void deleteAdoptionHistory(UUID id) {
        if (!adoptionHistoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Historial de adopción no encontrado con id: " + id);
        }
        adoptionHistoryRepository.deleteById(id);
    }

    // --- Métodos Privados ---

    private void updateEntityFromRequest(AdoptionHistory adoption, AdoptionHistoryRequestDTO dto) {
        adoption.setDate(dto.date());

        Animal animal = animalRepository.findById(dto.animalId())
                .orElseThrow(() -> new EntityNotFoundException("Animal no encontrado con id: " + dto.animalId()));
        adoption.setAnimal(animal);

        User adopter = userRepository.findById(dto.adopterId())
                .orElseThrow(() -> new EntityNotFoundException("Adoptante no encontrado con id: " + dto.adopterId()));
        adoption.setAdopter(adopter);
    }

    private AdoptionHistoryResponseDTO mapToResponse(AdoptionHistory adoption) {
        UUID animalId = adoption.getAnimal() != null ? adoption.getAnimal().getId() : null;
        UUID adopterId = adoption.getAdopter() != null ? adoption.getAdopter().getId() : null;

        return new AdoptionHistoryResponseDTO(
                adoption.getId(),
                animalId,
                adopterId,
                adoption.getDate()
        );
    }
}