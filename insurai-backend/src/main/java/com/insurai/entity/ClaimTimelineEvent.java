package com.insurai.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "claim_timeline_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimTimelineEvent {

    @Id
    private String id;

    private String claimId;

    private EventType type;

    private String title;

    private String description;

    private LocalDateTime timestamp;

    private String userName;

    private String userId;

    // Additional metadata
    private String metadata; // JSON string for flexible data

    public enum EventType {
        STATUS_CHANGE,
        NOTE_ADDED,
        DOCUMENT_UPLOADED,
        ASSIGNED,
        AI_ANALYSIS,
        PAYMENT_PROCESSED,
        EMAIL_SENT,
        CLAIM_APPEALED
    }
}