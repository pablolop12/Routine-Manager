package com.pablolopezlujan.tfggimnasio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pablolopezlujan.tfggimnasio.entity.ConfirmationToken;
import java.util.Optional;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {
    Optional<ConfirmationToken> findByToken(String token);
}
