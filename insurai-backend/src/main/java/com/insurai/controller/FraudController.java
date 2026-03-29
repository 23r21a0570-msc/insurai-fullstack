package com.insurai.controller;

import com.insurai.dto.response.ApiResponse;
import com.insurai.entity.FraudAlert;
import com.insurai.service.FraudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ANALYST')")
public class FraudController {

    @Autowired
    private FraudService fraudService;

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<FraudAlert>>> getAllAlerts() {
        List<FraudAlert> alerts = fraudService.getAllAlerts();
        return ResponseEntity.ok(ApiResponse.success("Fraud alerts retrieved", alerts));
    }

    @GetMapping("/alerts/active")
    public ResponseEntity<ApiResponse<List<FraudAlert>>> getActiveAlerts() {
        List<FraudAlert> alerts = fraudService.getActiveAlerts();
        return ResponseEntity.ok(ApiResponse.success("Active alerts retrieved", alerts));
    }

    @GetMapping("/alerts/claim/{claimId}")
    public ResponseEntity<ApiResponse<List<FraudAlert>>> getAlertsByClaimId(@PathVariable String claimId) {
        List<FraudAlert> alerts = fraudService.getAlertsByClaimId(claimId);
        return ResponseEntity.ok(ApiResponse.success("Claim alerts retrieved", alerts));
    }

    @PutMapping("/alerts/{id}")
    public ResponseEntity<ApiResponse<FraudAlert>> updateAlertStatus(
            @PathVariable String id,
            @RequestParam FraudAlert.AlertStatus status,
            @RequestParam(required = false) String resolvedBy,
            @RequestParam(required = false) String notes
    ) {
        FraudAlert alert = fraudService.updateAlertStatus(id, status, resolvedBy, notes);
        return ResponseEntity.ok(ApiResponse.success("Alert updated", alert));
    }
}