package com.insurai.dto.response;

import com.insurai.entity.PolicyStatus;
import com.insurai.entity.PolicyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyResponse {

    private String id;
    private String policyNumber;
    private PolicyType type;
    
    private String holderName;
    private String holderEmail;
    private String holderPhone;
    
    private BigDecimal coverageAmount;
    private BigDecimal premium;
    private BigDecimal deductible;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private PolicyStatus status;
    
    private Integer claimsCount;
    private BigDecimal totalClaimsAmount;
    
    private LocalDate nextPaymentDate;
    private BigDecimal nextPaymentAmount;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}