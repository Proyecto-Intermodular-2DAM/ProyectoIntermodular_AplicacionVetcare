package com.vetcare.vetapp.controller;

import com.vetcare.vetapp.domain.CenterType;
import com.vetcare.vetapp.dto.CenterPatchDTO;
import com.vetcare.vetapp.dto.CenterResponseDTO;
import com.vetcare.vetapp.dto.request.CenterRequestDTO;
import com.vetcare.vetapp.service.CenterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/centers")
@RequiredArgsConstructor
public class CenterController {

    private final CenterService centerService;

    // GET completo: devuelve todos o filtra por ciudad y/o tipo
    @GetMapping
    public ResponseEntity<List<CenterResponseDTO>> getCenters(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) CenterType type) {

        return ResponseEntity.ok(centerService.getCenters(city, type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CenterResponseDTO> getCenterById(@PathVariable UUID id) {
        return ResponseEntity.ok(centerService.getCenterById(id));
    }

    @PostMapping
    public ResponseEntity<CenterResponseDTO> createCenter(
            @Valid @RequestBody CenterRequestDTO requestDTO) {
        CenterResponseDTO createdCenter = centerService.createCenter(requestDTO);
        return new ResponseEntity<>(createdCenter, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CenterResponseDTO> updateCenter(
            @PathVariable UUID id,
            @Valid @RequestBody CenterRequestDTO requestDTO) {
        return ResponseEntity.ok(centerService.updateCenter(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CenterResponseDTO> patchCenter(
            @PathVariable UUID id,
            @RequestBody CenterPatchDTO patchDTO) {
        return ResponseEntity.ok(centerService.patchCenter(id, patchDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCenter(@PathVariable UUID id) {
        centerService.deleteCenter(id);
        return ResponseEntity.noContent().build();
    }
}