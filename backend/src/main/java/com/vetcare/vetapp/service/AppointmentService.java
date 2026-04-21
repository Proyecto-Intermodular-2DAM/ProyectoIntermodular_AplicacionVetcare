package com.vetcare.vetapp.service;

import com.vetcare.vetapp.domain.*;
import com.vetcare.vetapp.dto.AppointmentPatchDTO;
import com.vetcare.vetapp.dto.request.AppointmentRequestDTO;
import com.vetcare.vetapp.dto.AppointmentResponseDTO;
import com.vetcare.vetapp.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AnimalRepository animalRepository;
    private final RoomRepository roomRepository;

    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<AppointmentResponseDTO> getAppointmentsByClientId(UUID clientId) {
        if (!userRepository.existsById(clientId)) {
            throw new EntityNotFoundException("Cliente no encontrado con id: " + clientId);
        }

        return appointmentRepository.findByClientId(clientId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AppointmentResponseDTO getAppointmentById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));
        return mapToResponse(appointment);
    }

    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO requestDTO) {
        Appointment appointment = new Appointment();
        updateEntityFromRequest(appointment, requestDTO);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment);
    }

    public AppointmentResponseDTO updateAppointment(UUID id, AppointmentRequestDTO requestDTO) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));

        updateEntityFromRequest(appointment, requestDTO);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(updatedAppointment);
    }

    public AppointmentResponseDTO patchAppointment(UUID id, AppointmentPatchDTO patchDTO) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));

        if (patchDTO.date() != null) appointment.setDate(patchDTO.date());
        if (patchDTO.time() != null) appointment.setTime(patchDTO.time());
        if (patchDTO.reason() != null) appointment.setReason(patchDTO.reason());
        if (patchDTO.status() != null) appointment.setStatus(patchDTO.status());

        if (patchDTO.clientId() != null) {
            User client = userRepository.findById(patchDTO.clientId())
                    .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
            appointment.setClient(client);
        }

        if (patchDTO.animalId() != null) {
            Animal animal = animalRepository.findById(patchDTO.animalId())
                    .orElseThrow(() -> new EntityNotFoundException("Animal no encontrado"));
            appointment.setAnimal(animal);
        }

        if (patchDTO.receptionistId() != null) {
            User receptionist = userRepository.findById(patchDTO.receptionistId())
                    .orElseThrow(() -> new EntityNotFoundException("Recepcionista no encontrado"));
            appointment.setReceptionist(receptionist);
        }

        if (patchDTO.roomId() != null) {
            Room room = roomRepository.findById(patchDTO.roomId())
                    .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada"));
            appointment.setRoom(room);
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(updatedAppointment);
    }

    public void deleteAppointment(UUID id) {
        if (!appointmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Cita no encontrada con id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    // --- Métodos Privados ---

    private void updateEntityFromRequest(Appointment appointment, AppointmentRequestDTO dto) {
        appointment.setDate(dto.date());
        appointment.setTime(dto.time());
        appointment.setReason(dto.reason());
        appointment.setStatus(dto.status());

        User client = userRepository.findById(dto.clientId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con id: " + dto.clientId()));
        appointment.setClient(client);

        Animal animal = animalRepository.findById(dto.animalId())
                .orElseThrow(() -> new EntityNotFoundException("Animal no encontrado con id: " + dto.animalId()));
        appointment.setAnimal(animal);

        // Relaciones opcionales (pueden ser nulas)
        if (dto.receptionistId() != null) {
            User receptionist = userRepository.findById(dto.receptionistId())
                    .orElseThrow(() -> new EntityNotFoundException("Recepcionista no encontrado"));
            appointment.setReceptionist(receptionist);
        } else {
            appointment.setReceptionist(null);
        }

        if (dto.roomId() != null) {
            Room room = roomRepository.findById(dto.roomId())
                    .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada"));
            appointment.setRoom(room);
        } else {
            appointment.setRoom(null);
        }
    }

    private AppointmentResponseDTO mapToResponse(Appointment appointment) {
        return new AppointmentResponseDTO(
                appointment.getId(),
                appointment.getDate(),
                appointment.getTime(),
                appointment.getReason(),
                appointment.getStatus(),
                appointment.getReceptionist() != null ? appointment.getReceptionist().getId() : null,
                appointment.getClient() != null ? appointment.getClient().getId() : null,
                appointment.getAnimal() != null ? appointment.getAnimal().getId() : null,
                appointment.getRoom() != null ? appointment.getRoom().getId() : null
        );
    }
}