package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Room;
import com.vetcare.vetapp.domain.User;
import com.vetcare.vetapp.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User getUserById(UUID id);

    Optional<User> findByEmail(String email);

    Optional<User> findByDni(String dni);

    List<User> findByRole(UserRole role);
}
