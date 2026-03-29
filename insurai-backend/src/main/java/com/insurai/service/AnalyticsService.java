package com.insurai.service;

import com.insurai.dto.response.DashboardStatsResponse;
import com.insurai.entity.ClaimStatus;
import com.insurai.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AnalyticsService {

    @Autowired
    private ClaimRepository claimRepository;

    public DashboardStatsResponse getDashboardStats() {
        Long totalClaims = claimRepository.count();
        Long pendingReview = claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW) +
                             claimRepository.countByStatus(ClaimStatus.SUBMITTED) +
                             claimRepository.countByStatus(ClaimStatus.PENDING_INFO);
        Long approved = claimRepository.countByStatus(ClaimStatus.APPROVED);
        Long fraudDetected = claimRepository.countHighRiskClaims();

        double approvalRate = totalClaims > 0 ? (approved.doubleValue() / totalClaims) * 100 : 0;

        return DashboardStatsResponse.builder()
                .totalClaims(totalClaims)
                .claimsChange(12.5)
                .pendingReview(pendingReview)
                .pendingChange(-5.2)
                .approvalRate(approvalRate)
                .approvalChange(3.1)
                .avgProcessingTime(2.4)
                .processingChange(-15.3)
                .fraudDetected(fraudDetected)
                .fraudChange(8.7)
                .totalPayout(BigDecimal.valueOf(1250000))
                .payoutChange(22.4)
                .build();
    }
}