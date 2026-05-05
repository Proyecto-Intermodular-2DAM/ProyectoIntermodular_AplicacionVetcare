package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {

}
