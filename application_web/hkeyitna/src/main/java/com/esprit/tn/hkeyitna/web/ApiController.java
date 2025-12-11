package com.esprit.tn.hkeyitna.web;

import com.esprit.tn.hkeyitna.domain.AuditLog;
import com.esprit.tn.hkeyitna.domain.Event;
import com.esprit.tn.hkeyitna.domain.UserAccount;
import com.esprit.tn.hkeyitna.repository.AuditLogRepository;
import com.esprit.tn.hkeyitna.repository.UserAccountRepository;
import com.esprit.tn.hkeyitna.service.SyncService;
import com.esprit.tn.hkeyitna.service.EventService;
import com.esprit.tn.hkeyitna.web.dto.EventDto;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ApiController {
    private final SyncService syncService;
    private final EventService eventService;
    private final AuditLogRepository auditLogRepository;
    private final UserAccountRepository userAccountRepository;

    public ApiController(SyncService syncService, EventService eventService, AuditLogRepository auditLogRepository,
            UserAccountRepository userAccountRepository) {
        this.syncService = syncService;
        this.eventService = eventService;
        this.auditLogRepository = auditLogRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @GetMapping("/events")
    public List<Event> events() {
        return eventService.findAll();
    }

    @PostMapping("/events")
    public Event create(@RequestBody @jakarta.validation.Valid EventDto dto) {
        return eventService.create(EventDto.toEntity(dto));
    }

    @PutMapping("/events/{id}")
    public Event update(@PathVariable Long id, @RequestBody @jakarta.validation.Valid EventDto dto) {
        return eventService.update(id, EventDto.toEntity(dto));
    }

    @DeleteMapping("/events/{id}")
    public void delete(@PathVariable Long id) {
        eventService.delete(id);
    }

    @PostMapping("/sync/push")
    public String push() {
        return syncService.pushEdtToOutlook();
    }

    @PostMapping("/sync/pull")
    public String pull() {
        return syncService.pullOutlookToEdt();
    }

    @GetMapping("/logs")
    public List<AuditLog> logs() {
        return auditLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // Gestion des utilisateurs (admin only)
    @GetMapping("/users")
    public List<UserAccount> getUsers() {
        return userAccountRepository.findAll();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserAccount> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        UserAccount user = userAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(body.get("role"));
        return ResponseEntity.ok(userAccountRepository.save(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userAccountRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
