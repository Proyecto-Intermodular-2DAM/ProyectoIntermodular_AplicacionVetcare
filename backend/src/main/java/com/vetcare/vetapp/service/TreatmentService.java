package com.vetcare.vetapp.service;

import com.vetcare.vetapp.domain.Appointment;
import com.vetcare.vetapp.domain.Treatment;
import com.vetcare.vetapp.domain.User;
import com.vetcare.vetapp.dto.TreatmentPatchDTO;
import com.vetcare.vetapp.dto.TreatmentResponseDTO;
import com.vetcare.vetapp.dto.request.TreatmentRequestDTO;
import com.vetcare.vetapp.repository.AppointmentRepository;
import com.vetcare.vetapp.repository.TreatmentRepository;
import com.vetcare.vetapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public List<TreatmentResponseDTO> getTreatments(UUID appointmentId, UUID employeeId) {
        List<Treatment> treatments;

        if (appointmentId != null && employeeId != null) {
            treatments = treatmentRepository.findByAppointmentIdAndEmployeeId(appointmentId, employeeId);
        } else if (appointmentId != null) {
            treatments = treatmentRepository.findByAppointmentId(appointmentId);
        } else if (employeeId != null) {
            treatments = treatmentRepository.findByEmployeeId(employeeId);
        } else {
            treatments = treatmentRepository.findAll();
        }

        return treatments.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TreatmentResponseDTO getTreatmentById(UUID id) {
        Treatment treatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tratamiento no encontrado con id: " + id));
        return mapToResponse(treatment);
    }

    public TreatmentResponseDTO createTreatment(TreatmentRequestDTO requestDTO) {
        Treatment treatment = new Treatment();
        updateEntityFromRequest(treatment, requestDTO);
        Treatment savedTreatment = treatmentRepository.save(treatment);
        return mapToResponse(savedTreatment);
    }

    public TreatmentResponseDTO updateTreatment(UUID id, TreatmentRequestDTO requestDTO) {
        Treatment treatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tratamiento no encontrado con id: " + id));

        updateEntityFromRequest(treatment, requestDTO);
        Treatment updatedTreatment = treatmentRepository.save(treatment);
        return mapToResponse(updatedTreatment);
    }

    public TreatmentResponseDTO patchTreatment(UUID id, TreatmentPatchDTO patchDTO) {
        Treatment treatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tratamiento no encontrado con id: " + id));

        if (patchDTO.description() != null) treatment.setDescription(patchDTO.description());
        if (patchDTO.medication() != null) treatment.setMedication(patchDTO.medication());
        if (patchDTO.dosage() != null) treatment.setDosage(patchDTO.dosage());

        if (patchDTO.appointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(patchDTO.appointmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada"));
            treatment.setAppointment(appointment);
        }

        if (patchDTO.employeeId() != null) {
            User employee = userRepository.findById(patchDTO.employeeId())
                    .orElseThrow(() -> new EntityNotFoundException("Empleado/Veterinario no encontrado"));
            treatment.setEmployee(employee);
        }

        Treatment updatedTreatment = treatmentRepository.save(treatment);
        return mapToResponse(updatedTreatment);
    }

    public void deleteTreatment(UUID id) {
        if (!treatmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Tratamiento no encontrado con id: " + id);
        }
        treatmentRepository.deleteById(id);
    }

    // --- Métodos Privados ---

    private void updateEntityFromRequest(Treatment treatment, TreatmentRequestDTO dto) {
        treatment.setDescription(dto.description());
        treatment.setMedication(dto.medication());
        treatment.setDosage(dto.dosage());

        Appointment appointment = appointmentRepository.findById(dto.appointmentId())
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + dto.appointmentId()));
        treatment.setAppointment(appointment);

        User employee = userRepository.findById(dto.employeeId())
                .orElseThrow(() -> new EntityNotFoundException("Empleado/Veterinario no encontrado con id: " + dto.employeeId()));
        treatment.setEmployee(employee);
    }

    private TreatmentResponseDTO mapToResponse(Treatment treatment) {
        return new TreatmentResponseDTO(
                treatment.getId(),
                treatment.getDescription(),
                treatment.getMedication(),
                treatment.getDosage(),
                treatment.getAppointment() != null ? treatment.getAppointment().getId() : null,
                treatment.getEmployee() != null ? treatment.getEmployee().getId() : null
        );
    }
}