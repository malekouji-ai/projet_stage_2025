package com.esprit.tn.hkeyitna.service;

import com.esprit.tn.hkeyitna.domain.Event;
import com.esprit.tn.hkeyitna.domain.EventSource;
import com.esprit.tn.hkeyitna.repository.EventRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SyncService {
    private final EventRepository eventRepository;
    private final AuditService auditService;

    @Value("${app.sync.mock-mode:true}")
    private boolean mockMode;

    public SyncService(EventRepository eventRepository, AuditService auditService) {
        this.eventRepository = eventRepository;
        this.auditService = auditService;
    }

    public List<Event> listAll() {
        return eventRepository.findAll();
    }

    @Transactional
    public String pushEdtToOutlook() {
        auditService.info("Push EDT → Outlook triggered", "Mode: " + (mockMode ? "MOCK" : "REAL"));

        try {
            if (mockMode) {
                return pushEdtToOutlookMock();
            } else {
                auditService.warn("Microsoft Graph not configured - use mock mode", null);
                return "PUSH_SKIPPED_NO_CONFIG";
            }
        } catch (Exception e) {
            auditService.error("Push failed: " + e.getMessage(), e.getClass().getName());
            return "PUSH_FAILED: " + e.getMessage();
        }
    }

    @Transactional
    private String pushEdtToOutlookMock() {
        List<Event> edtEvents = eventRepository.findBySource(EventSource.EDT);
        int pushed = 0;
        int updated = 0;

        for (Event event : edtEvents) {
            if (event.getExternalId() == null || event.getExternalId().isEmpty()) {
                // Simuler la création dans Outlook avec un ID fictif
                String mockOutlookId = "outlook-" + UUID.randomUUID().toString();
                event.setExternalId(mockOutlookId);
                eventRepository.save(event);
                pushed++;
                auditService.info("Event pushed to Outlook (MOCK): " + event.getTitle(), "Mock ID: " + mockOutlookId);
            } else {
                // Simuler la mise à jour
                updated++;
                auditService.info("Event updated in Outlook (MOCK): " + event.getTitle(),
                        "Mock ID: " + event.getExternalId());
            }
        }

        String message = String.format("✓ MOCK: Pushed %d new, updated %d events", pushed, updated);
        auditService.info("Push completed (MOCK)", message);
        return "PUSH_COMPLETED: " + message;
    }

    @Transactional
    public String pullOutlookToEdt() {
        auditService.info("Pull Outlook → EDT triggered", "Mode: " + (mockMode ? "MOCK" : "REAL"));

        try {
            if (mockMode) {
                return pullOutlookToEdtMock();
            } else {
                auditService.warn("Microsoft Graph not configured - use mock mode", null);
                return "PULL_SKIPPED_NO_CONFIG";
            }
        } catch (Exception e) {
            auditService.error("Pull failed: " + e.getMessage(), e.getClass().getName());
            return "PULL_FAILED: " + e.getMessage();
        }
    }

    @Transactional
    private String pullOutlookToEdtMock() {
        int imported = 0;

        // Simuler l'importation de quelques événements fictifs depuis Outlook
        // Créer 2-3 événements simulés la première fois
        List<Event> existingOutlookEvents = eventRepository.findBySource(EventSource.OUTLOOK);

        if (existingOutlookEvents.size() < 3) {
            for (int i = 1; i <= 3; i++) {
                String mockId = "outlook-mock-" + UUID.randomUUID().toString();

                // Vérifier si cet événement n'existe pas déjà
                if (eventRepository.findByExternalId(mockId).isEmpty()) {
                    Event mockEvent = new Event();
                    mockEvent.setTitle("Événement Outlook Simulé #" + i);
                    mockEvent.setDescription("Ceci est un événement de démonstration importé depuis Outlook (simulé)");
                    mockEvent.setLocation("France");
                    mockEvent.setSource(EventSource.OUTLOOK);
                    mockEvent.setExternalId(mockId);
                    mockEvent.setStartAt(OffsetDateTime.now().plusDays(i).withHour(10).withMinute(0));
                    mockEvent.setEndAt(OffsetDateTime.now().plusDays(i).withHour(11).withMinute(0));

                    eventRepository.save(mockEvent);
                    imported++;
                    auditService.info("Event imported from Outlook (MOCK): " + mockEvent.getTitle(),
                            "Mock ID: " + mockId);
                }
            }
        }

        String message = String.format("✓ MOCK: Imported %d new events from Outlook", imported);
        auditService.info("Pull completed (MOCK)", message);
        return "PULL_COMPLETED: " + message;
    }

    public boolean hasConflict(OffsetDateTime start, OffsetDateTime end) {
        List<Event> overlapping = eventRepository.findOverlapping(start, end);
        return !overlapping.isEmpty();
    }

    @Scheduled(fixedDelayString = "${app.sync.fixed-delay-ms:3600000}")
    public void scheduledSync() {
        if (mockMode) {
            auditService.info("Scheduled sync started (MOCK MODE)", null);
            pushEdtToOutlook();
            pullOutlookToEdt();
            auditService.info("Scheduled sync completed (MOCK MODE)", null);
        }
    }
}
