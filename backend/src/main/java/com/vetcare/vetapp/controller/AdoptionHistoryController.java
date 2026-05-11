package com.vetcare.vetapp.controller;

import com.vetcare.vetapp.dto.AdoptionHistoryPatchDTO;
import com.vetcare.vetapp.dto.request.AdoptionHistoryRequestDTO;
import com.vetcare.vetapp.dto.AdoptionHistoryResponseDTO;
import com.vetcare.vetapp.service.AdoptionHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionHistoryController {

    private final AdoptionHistoryService adoptionHistoryService;

    @GetMapping("/{id}")
    public ResponseEntity<AdoptionHistoryResponseDTO> getAdoptionHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(adoptionHistoryService.getAdoptionHistoryById(id));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<AdoptionHistoryResponseDTO>> getAllAdoptions(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(adoptionHistoryService.getAdoptionsByUserId(userId));

    }

    @PostMapping
    public ResponseEntity<AdoptionHistoryResponseDTO> createAdoptionHistory(
            @Valid @RequestBody AdoptionHistoryRequestDTO requestDTO) {
        AdoptionHistoryResponseDTO createdAdoption = adoptionHistoryService.createAdoptionHistory(requestDTO);
        return new ResponseEntity<>(createdAdoption, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdoptionHistoryResponseDTO> updateAdoptionHistory(
            @PathVariable UUID id,
            @Valid @RequestBody AdoptionHistoryRequestDTO requestDTO) {
        return ResponseEntity.ok(adoptionHistoryService.updateAdoptionHistory(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AdoptionHistoryResponseDTO> patchAdoptionHistory(
            @PathVariable UUID id,
            @RequestBody AdoptionHistoryPatchDTO patchDTO) {
        return ResponseEntity.ok(adoptionHistoryService.patchAdoptionHistory(id, patchDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdoptionHistory(@PathVariable UUID id) {
        adoptionHistoryService.deleteAdoptionHistory(id);
        return ResponseEntity.noContent().build();
    }
}