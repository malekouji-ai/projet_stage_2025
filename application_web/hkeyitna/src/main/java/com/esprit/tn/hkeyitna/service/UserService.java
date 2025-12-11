package com.esprit.tn.hkeyitna.service;

import com.esprit.tn.hkeyitna.domain.UserAccount;
import com.esprit.tn.hkeyitna.repository.UserAccountRepository;
import com.esprit.tn.hkeyitna.web.dto.UserDto;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserAccountRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserAccountRepository repo) { this.repo = repo; }

    public List<UserAccount> findAll() { return repo.findAll(); }
    public UserAccount findById(Long id) { return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found")); }

    public UserAccount create(UserDto dto) {
        UserAccount u = new UserAccount();
        u.setUsername(dto.username);
        u.setEmail(dto.email);
        u.setRole(dto.role == null ? "user" : dto.role);
        if (dto.password == null || dto.password.isBlank()) throw new IllegalArgumentException("password required");
        u.setPasswordHash(encoder.encode(dto.password));
        return repo.save(u);
    }

    public UserAccount update(Long id, UserDto dto) {
        UserAccount u = findById(id);
        if (dto.username != null && !dto.username.isBlank()) u.setUsername(dto.username);
        if (dto.email != null && !dto.email.isBlank()) u.setEmail(dto.email);
        if (dto.role != null && !dto.role.isBlank()) u.setRole(dto.role);
        if (dto.password != null && !dto.password.isBlank()) u.setPasswordHash(encoder.encode(dto.password));
        return repo.save(u);
    }

    public void delete(Long id) { repo.deleteById(id); }
}

