package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Room;
import com.vetcare.vetapp.domain.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TreatmentRepository extends JpaRepository<Treatment, UUID> {
    // Buscar tratamientos dados en una cita específica
    List<Treatment> findByAppointmentId(UUID appointmentId);

    // Buscar tratamientos recetados por un empleado o veterinario específico
    List<Treatment> findByEmployeeId(UUID employeeId);

    // Buscar por cita y empleado
    List<Treatment> findByAppointmentIdAndEmployeeId(UUID appointmentId, UUID employeeId);
}
