package com.esprit.tn.hkeyitna.service;

import com.esprit.tn.hkeyitna.domain.Event;
import com.esprit.tn.hkeyitna.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    private final EventRepository repository;
    public EventService(EventRepository repository) { this.repository = repository; }

    public List<Event> findAll() { return repository.findAll(); }
    public Event findById(Long id) { return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Event not found")); }
    public Event create(Event e) { return repository.save(e); }
    public Event update(Long id, Event updated) {
        Event existing = findById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStartAt(updated.getStartAt());
        existing.setEndAt(updated.getEndAt());
        existing.setLocation(updated.getLocation());
        existing.setSource(updated.getSource());
        existing.setExternalId(updated.getExternalId());
        return repository.save(existing);
    }
    public void delete(Long id) { repository.deleteById(id); }
}

