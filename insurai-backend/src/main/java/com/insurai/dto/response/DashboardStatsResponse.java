package com.insurai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private Long totalClaims;
    private Double claimsChange;
    
    private Long pendingReview;
    private Double pendingChange;
    
    private Double approvalRate;
    private Double approvalChange;
    
    private Double avgProcessingTime;
    private Double processingChange;
    
    private Long fraudDetected;
    private Double fraudChange;
    
    private BigDecimal totalPayout;
    private Double payoutChange;
}