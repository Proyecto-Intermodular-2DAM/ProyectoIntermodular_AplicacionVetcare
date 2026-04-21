package com.vetcare.vetapp.service;

import com.vetcare.vetapp.domain.Center;
import com.vetcare.vetapp.domain.CenterType;
import com.vetcare.vetapp.dto.CenterPatchDTO;
import com.vetcare.vetapp.dto.CenterResponseDTO;
import com.vetcare.vetapp.dto.request.CenterRequestDTO;
import com.vetcare.vetapp.repository.CenterRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CenterService {

    private final CenterRepository centerRepository;

    public List<CenterResponseDTO> getCenters(String city, CenterType type) {
        List<Center> centers;

        if (city != null && type != null) {
            centers = centerRepository.findByCityContainingIgnoreCaseAndType(city, type);
        } else if (city != null) {
            centers = centerRepository.findByCityContainingIgnoreCase(city);
        } else if (type != null) {
            centers = centerRepository.findByType(type);
        } else {
            centers = centerRepository.findAll();
        }

        return centers.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CenterResponseDTO getCenterById(UUID id) {
        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Centro no encontrado con id: " + id));
        return mapToResponse(center);
    }

    public CenterResponseDTO createCenter(CenterRequestDTO requestDTO) {
        Center center = new Center();
        updateEntityFromRequest(center, requestDTO);
        Center savedCenter = centerRepository.save(center);
        return mapToResponse(savedCenter);
    }

    public CenterResponseDTO updateCenter(UUID id, CenterRequestDTO requestDTO) {
        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Centro no encontrado con id: " + id));

        updateEntityFromRequest(center, requestDTO);
        Center updatedCenter = centerRepository.save(center);
        return mapToResponse(updatedCenter);
    }

    public CenterResponseDTO patchCenter(UUID id, CenterPatchDTO patchDTO) {
        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Centro no encontrado con id: " + id));

        if (patchDTO.name() != null) center.setName(patchDTO.name());
        if (patchDTO.address() != null) center.setAddress(patchDTO.address());
        if (patchDTO.city() != null) center.setCity(patchDTO.city());
        if (patchDTO.postcode() != null) center.setPostcode(patchDTO.postcode());
        if (patchDTO.type() != null) center.setType(patchDTO.type());

        Center updatedCenter = centerRepository.save(center);
        return mapToResponse(updatedCenter);
    }

    public void deleteCenter(UUID id) {
        if (!centerRepository.existsById(id)) {
            throw new EntityNotFoundException("Centro no encontrado con id: " + id);
        }
        centerRepository.deleteById(id);
    }

    // --- Métodos Privados ---

    private void updateEntityFromRequest(Center center, CenterRequestDTO dto) {
        center.setName(dto.name());
        center.setAddress(dto.address());
        center.setCity(dto.city());
        center.setPostcode(dto.postcode());
        center.setType(dto.type());
    }

    private CenterResponseDTO mapToResponse(Center center) {
        return new CenterResponseDTO(
                center.getId(),
                center.getName(),
                center.getAddress(),
                center.getCity(),
                center.getPostcode(),
                center.getType()
        );
    }
}