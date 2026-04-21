package com.vetcare.vetapp.controller;

import com.vetcare.vetapp.dto.AppointmentPatchDTO;
import com.vetcare.vetapp.dto.AppointmentResponseDTO;
import com.vetcare.vetapp.dto.request.AppointmentRequestDTO;
import com.vetcare.vetapp.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments") // Sin el /v1
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // GET completo: devuelve todos o filtra por cliente si se pasa el request param ?clientId=...
    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> getAppointments(
            @RequestParam(required = false) UUID clientId) {

        if (clientId != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByClientId(clientId));
        }

        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(
            @Valid @RequestBody AppointmentRequestDTO requestDTO) {
        AppointmentResponseDTO createdAppointment = appointmentService.createAppointment(requestDTO);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> updateAppointment(
            @PathVariable UUID id,
            @Valid @RequestBody AppointmentRequestDTO requestDTO) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> patchAppointment(
            @PathVariable UUID id,
            @RequestBody AppointmentPatchDTO patchDTO) {
        return ResponseEntity.ok(appointmentService.patchAppointment(id, patchDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}