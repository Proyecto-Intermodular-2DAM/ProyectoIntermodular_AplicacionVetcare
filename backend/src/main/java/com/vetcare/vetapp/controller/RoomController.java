package com.vetcare.vetapp.controller;

import com.vetcare.vetapp.dto.RoomPatchDTO;
import com.vetcare.vetapp.dto.RoomResponseDTO;
import com.vetcare.vetapp.dto.request.RoomRequestDTO;
import com.vetcare.vetapp.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // GET completo: devuelve todas o filtra por centro si pasas ?centerId=...
    @GetMapping
    public ResponseEntity<List<RoomResponseDTO>> getRooms(
            @RequestParam(required = false) UUID centerId) {
        return ResponseEntity.ok(roomService.getRooms(centerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(@PathVariable UUID id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping
    public ResponseEntity<RoomResponseDTO> createRoom(
            @Valid @RequestBody RoomRequestDTO requestDTO) {
        RoomResponseDTO createdRoom = roomService.createRoom(requestDTO);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> updateRoom(
            @PathVariable UUID id,
            @Valid @RequestBody RoomRequestDTO requestDTO) {
        return ResponseEntity.ok(roomService.updateRoom(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> patchRoom(
            @PathVariable UUID id,
            @RequestBody RoomPatchDTO patchDTO) {
        return ResponseEntity.ok(roomService.patchRoom(id, patchDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}