package com.esprit.tn.hkeyitna.web.dto;

import com.esprit.tn.hkeyitna.domain.Event;
import com.esprit.tn.hkeyitna.domain.EventSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public class EventDto {
    @NotBlank
    public String title;
    public String description;
    public String location;
    @NotNull
    public EventSource source;
    public String externalId;
    @NotNull
    public OffsetDateTime startAt;
    @NotNull
    public OffsetDateTime endAt;

    public static Event toEntity(EventDto d) {
        Event e = new Event();
        e.setTitle(d.title);
        e.setDescription(d.description);
        e.setLocation(d.location);
        e.setSource(d.source);
        e.setExternalId(d.externalId);
        e.setStartAt(d.startAt);
        e.setEndAt(d.endAt);
        return e;
    }
}
