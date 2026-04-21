package com.vetcare.vetapp.controller;

import com.vetcare.vetapp.dto.TreatmentPatchDTO;
import com.vetcare.vetapp.dto.TreatmentResponseDTO;
import com.vetcare.vetapp.dto.request.TreatmentRequestDTO;
import com.vetcare.vetapp.service.TreatmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/treatments")
@RequiredArgsConstructor
public class TreatmentController {

    private final TreatmentService treatmentService;

    // GET completo: devuelve todos o filtra por cita y/o empleado
    @GetMapping
    public ResponseEntity<List<TreatmentResponseDTO>> getTreatments(
            @RequestParam(required = false) UUID appointmentId,
            @RequestParam(required = false) UUID employeeId) {

        return ResponseEntity.ok(treatmentService.getTreatments(appointmentId, employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreatmentResponseDTO> getTreatmentById(@PathVariable UUID id) {
        return ResponseEntity.ok(treatmentService.getTreatmentById(id));
    }

    @PostMapping
    public ResponseEntity<TreatmentResponseDTO> createTreatment(
            @Valid @RequestBody TreatmentRequestDTO requestDTO) {
        TreatmentResponseDTO createdTreatment = treatmentService.createTreatment(requestDTO);
        return new ResponseEntity<>(createdTreatment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreatmentResponseDTO> updateTreatment(
            @PathVariable UUID id,
            @Valid @RequestBody TreatmentRequestDTO requestDTO) {
        return ResponseEntity.ok(treatmentService.updateTreatment(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TreatmentResponseDTO> patchTreatment(
            @PathVariable UUID id,
            @RequestBody TreatmentPatchDTO patchDTO) {
        return ResponseEntity.ok(treatmentService.patchTreatment(id, patchDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatment(@PathVariable UUID id) {
        treatmentService.deleteTreatment(id);
        return ResponseEntity.noContent().build();
    }
}