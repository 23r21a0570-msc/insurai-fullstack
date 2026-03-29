package com.insurai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String claimNumber;

    @Column(nullable = false)
    private String policyNumber;

    @Embedded
    private Claimant claimant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.SUBMITTED;

    private Integer riskScore;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private Integer fraudProbability;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Assignment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    private String assignedToName;

    // Documents stored in MongoDB - we store reference IDs
    @ElementCollection
    @CollectionTable(name = "claim_document_refs", joinColumns = @JoinColumn(name = "claim_id"))
    @Column(name = "document_id")
    private List<String> documentIds = new ArrayList<>();

    // Timeline events stored in MongoDB
    @ElementCollection
    @CollectionTable(name = "claim_timeline_refs", joinColumns = @JoinColumn(name = "claim_id"))
    @Column(name = "event_id")
    private List<String> timelineEventIds = new ArrayList<>();

    // Incident details
    private LocalDateTime incidentDate;
    private String incidentLocation;

    // Processing metadata
    private LocalDateTime reviewStartedAt;
    private LocalDateTime resolvedAt;
    private String rejectionReason;

    // AI Analysis stored as JSON in PostgreSQL
    @Column(columnDefinition = "TEXT")
    private String aiAnalysisJson;
}