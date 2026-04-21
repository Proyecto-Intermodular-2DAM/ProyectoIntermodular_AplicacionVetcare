package com.vetcare.vetapp.service;

import com.vetcare.vetapp.domain.Animal;
import com.vetcare.vetapp.domain.Center;
import com.vetcare.vetapp.domain.User;
import com.vetcare.vetapp.dto.AnimalPatchDTO;
import com.vetcare.vetapp.dto.request.AnimalRequestDTO;
import com.vetcare.vetapp.dto.AnimalResponseDTO;
import com.vetcare.vetapp.repository.AnimalRepository;
import com.vetcare.vetapp.repository.CenterRepository;
import com.vetcare.vetapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final UserRepository userRepository;
    private final CenterRepository centerRepository;

    public List<AnimalResponseDTO> getAllAnimals() {
        List<Animal> animals = animalRepository.findAll();

        return animals.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AnimalResponseDTO getAnimalById(UUID id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + id));
        return mapToResponse(animal);
    }

    public List<AnimalResponseDTO> getAnimalsByName(String name) {
        List<Animal> animals = animalRepository.findByNameContainingIgnoreCase(name);

        return animals.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AnimalResponseDTO createAnimal(AnimalRequestDTO requestDTO) {
        Animal animal = new Animal();
        updateEntityFromRequest(animal, requestDTO);
        Animal savedAnimal = animalRepository.save(animal);
        return mapToResponse(savedAnimal);
    }

    public AnimalResponseDTO updateAnimal(UUID id, AnimalRequestDTO requestDTO) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + id));

        updateEntityFromRequest(animal, requestDTO);
        Animal updatedAnimal = animalRepository.save(animal);
        return mapToResponse(updatedAnimal);
    }

    public AnimalResponseDTO patchAnimal(UUID id, AnimalPatchDTO patchDTO) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + id));

        // PATCH solo actualiza los campos que vienen en el JSON (no son nulos)
        if (patchDTO.name() != null) animal.setName(patchDTO.name());
        if (patchDTO.species() != null) animal.setSpecies(patchDTO.species());
        if (patchDTO.status() != null) animal.setStatus(patchDTO.status());
        if (patchDTO.animalImage() != null) animal.setAnimalImage(patchDTO.animalImage());

        if (patchDTO.ownerId() != null) {
            User owner = userRepository.findById(patchDTO.ownerId())
                    .orElseThrow(() -> new EntityNotFoundException("Owner not found"));
            animal.setOwner(owner);
        }

        if (patchDTO.centerId() != null) {
            Center center = centerRepository.findById(patchDTO.centerId())
                    .orElseThrow(() -> new EntityNotFoundException("Center not found"));
            animal.setCenter(center);
        }

        Animal updatedAnimal = animalRepository.save(animal);
        return mapToResponse(updatedAnimal);
    }

    public void deleteAnimal(UUID id) {
        if (!animalRepository.existsById(id)) {
            throw new EntityNotFoundException("Animal not found with id: " + id);
        }
        animalRepository.deleteById(id);
    }

    private void updateEntityFromRequest(Animal animal, AnimalRequestDTO dto) {
        animal.setName(dto.name());
        animal.setSpecies(dto.species());
        animal.setStatus(dto.status());
        animal.setAnimalImage(dto.animalImage());

        if (dto.ownerId() != null) {
            User owner = userRepository.getUserById(dto.ownerId());
            animal.setOwner(owner);
        } else {
            animal.setOwner(null);
        }

        if (dto.centerId() != null) {
            Center center = centerRepository.getCenterById(dto.centerId());
            animal.setCenter(center);
        } else {
            animal.setCenter(null);
        }
    }

    private AnimalResponseDTO mapToResponse(Animal animal) {
        UUID ownerId = animal.getOwner() != null ? animal.getOwner().getId() : null;
        UUID centerId = animal.getCenter() != null ? animal.getCenter().getId() : null;

        if (animal.getOwner() != null) {
            ownerId = animal.getOwner().getId();
        }
        if (animal.getCenter() != null){
            centerId = animal.getCenter().getId();
        }

        AnimalResponseDTO response = new AnimalResponseDTO(
        animal.getId(),
        animal.getName(),
        animal.getSpecies(),
        animal.getStatus(),
        animal.getAnimalImage(),
        centerId,
        ownerId);


        return response;
    }
}