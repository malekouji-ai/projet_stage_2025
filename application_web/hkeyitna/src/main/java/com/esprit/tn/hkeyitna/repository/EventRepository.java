package com.esprit.tn.hkeyitna.repository;

import com.esprit.tn.hkeyitna.domain.Event;
import com.esprit.tn.hkeyitna.domain.EventSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findBySource(EventSource source);

    @Query("SELECT e FROM Event e WHERE e.startAt < :end AND e.endAt > :start")
    List<Event> findOverlapping(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    Optional<Event> findByExternalId(String externalId);
}

