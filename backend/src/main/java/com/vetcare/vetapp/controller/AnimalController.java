package com.vetcare.vetapp.controller;

import com.vetcare.vetapp.dto.AnimalPatchDTO;
import com.vetcare.vetapp.dto.request.AnimalRequestDTO;
import com.vetcare.vetapp.dto.AnimalResponseDTO;
import com.vetcare.vetapp.service.AnimalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;

    // 1. GET - Obtener un recurso
    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> getAnimal(@PathVariable UUID id) {
        return ResponseEntity.ok(animalService.getAnimalById(id));
    }

    @GetMapping
    public ResponseEntity<List<AnimalResponseDTO>> getAnimals(
            @RequestParam(required = false) String name) {

        if (name != null && !name.trim().isEmpty()) {
            return ResponseEntity.ok(animalService.getAnimalsByName(name));
        } else {
            return ResponseEntity.ok(animalService.getAllAnimals());
        }
    }

    // 2. POST - Crear un recurso
    @PostMapping
    public ResponseEntity<AnimalResponseDTO> createAnimal(@Valid @RequestBody AnimalRequestDTO requestDTO) {
        AnimalResponseDTO createdAnimal = animalService.createAnimal(requestDTO);
        return new ResponseEntity<>(createdAnimal, HttpStatus.CREATED);
    }

    // 3. PUT - Reemplazar un recurso completo
    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> updateAnimal(
            @PathVariable UUID id,
            @Valid @RequestBody AnimalRequestDTO requestDTO) {
        return ResponseEntity.ok(animalService.updateAnimal(id, requestDTO));
    }

    // 4. PATCH - Actualizar parcialmente un recurso
    @PatchMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> patchAnimal(
            @PathVariable UUID id,
            @RequestBody AnimalPatchDTO patchDTO) {
        return ResponseEntity.ok(animalService.patchAnimal(id, patchDTO));
    }

    // 5. DELETE - Eliminar un recurso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable UUID id) {
        animalService.deleteAnimal(id);
        return ResponseEntity.noContent().build();
    }
}