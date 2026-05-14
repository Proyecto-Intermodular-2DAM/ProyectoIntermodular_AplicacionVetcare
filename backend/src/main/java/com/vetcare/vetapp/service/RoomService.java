package com.vetcare.vetapp.service;

import com.vetcare.vetapp.domain.Center;
import com.vetcare.vetapp.domain.Room;
import com.vetcare.vetapp.dto.RoomPatchDTO;
import com.vetcare.vetapp.dto.RoomResponseDTO;
import com.vetcare.vetapp.dto.request.RoomRequestDTO;
import com.vetcare.vetapp.repository.CenterRepository;
import com.vetcare.vetapp.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final CenterRepository centerRepository;

    public List<RoomResponseDTO> getRooms(UUID centerId) {
        List<Room> rooms;

        if (centerId != null) {
            if (!centerRepository.existsById(centerId)) {
                throw new EntityNotFoundException("Centro no encontrado con id: " + centerId);
            }
            rooms = roomRepository.findByCenterId(centerId);
        } else {
            rooms = roomRepository.findAll();
        }

        return rooms.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public RoomResponseDTO getRoomById(UUID id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con id: " + id));
        return mapToResponse(room);
    }

    public RoomResponseDTO createRoom(RoomRequestDTO requestDTO) {
        Room room = new Room();
        updateEntityFromRequest(room, requestDTO);
        Room savedRoom = roomRepository.save(room);
        return mapToResponse(savedRoom);
    }

    public RoomResponseDTO updateRoom(UUID id, RoomRequestDTO requestDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con id: " + id));

        updateEntityFromRequest(room, requestDTO);
        Room updatedRoom = roomRepository.save(room);
        return mapToResponse(updatedRoom);
    }

    public RoomResponseDTO patchRoom(UUID id, RoomPatchDTO patchDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con id: " + id));

        if (patchDTO.name() != null) {
            room.setName(patchDTO.name());
        }

        if (patchDTO.centerId() != null) {
            Center center = centerRepository.findById(patchDTO.centerId())
                    .orElseThrow(() -> new EntityNotFoundException("Centro no encontrado"));
            room.setCenter(center);
        }

        Room updatedRoom = roomRepository.save(room);
        return mapToResponse(updatedRoom);
    }

    public void deleteRoom(UUID id) {
        if (!roomRepository.existsById(id)) {
            throw new EntityNotFoundException("Sala no encontrada con id: " + id);
        }
        roomRepository.deleteById(id);
    }

    // --- Métodos Privados ---

    private void updateEntityFromRequest(Room room, RoomRequestDTO dto) {
        room.setName(dto.name());

        Center center = centerRepository.findById(dto.centerId())
                .orElseThrow(() -> new EntityNotFoundException("Centro no encontrado con id: " + dto.centerId()));
        room.setCenter(center);
    }

    private RoomResponseDTO mapToResponse(Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getName(),
                room.getCenter() != null ? room.getCenter().getId() : null
        );
    }
}