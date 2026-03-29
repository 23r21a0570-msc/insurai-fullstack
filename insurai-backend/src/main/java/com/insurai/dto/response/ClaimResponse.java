package com.insurai.dto.response;

import com.insurai.entity.ClaimStatus;
import com.insurai.entity.ClaimType;
import com.insurai.entity.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponse {

    private String id;
    private String claimNumber;
    private String policyNumber;
    
    private ClaimantDTO claimant;
    
    private ClaimType type;
    private String description;
    private BigDecimal amount;
    private ClaimStatus status;
    
    private Integer riskScore;
    private RiskLevel riskLevel;
    private Integer fraudProbability;
    
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    
    private String assignedToName;
    
    private List<String> documentIds;
    private List<String> timelineEventIds;
    
    private AIAnalysisDTO aiAnalysis;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClaimantDTO {
        private String name;
        private String email;
        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AIAnalysisDTO {
        private Integer riskScore;
        private Integer fraudProbability;
        private Integer confidence;
        private RiskLevel riskLevel;
        private String recommendation;
        private String modelVersion;
        private LocalDateTime analyzedAt;
        private Long processingTimeMs;
    }
}