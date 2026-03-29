package com.insurai.service;

import com.insurai.entity.FraudAlert;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.FraudAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FraudService {

    @Autowired
    private FraudAlertRepository fraudAlertRepository;

    public List<FraudAlert> getAllAlerts() {
        return fraudAlertRepository.findAll();
    }

    public List<FraudAlert> getActiveAlerts() {
        return fraudAlertRepository.findByStatusOrderByDetectedAtDesc(FraudAlert.AlertStatus.ACTIVE);
    }

    public List<FraudAlert> getAlertsByClaimId(String claimId) {
        return fraudAlertRepository.findByClaimId(claimId);
    }

    @Transactional
    public FraudAlert updateAlertStatus(String alertId, FraudAlert.AlertStatus status, String resolvedBy, String notes) {
        FraudAlert alert = fraudAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("FraudAlert", "id", alertId));
        alert.setStatus(status);
        alert.setResolvedBy(resolvedBy);
        alert.setResolutionNotes(notes);
        return fraudAlertRepository.save(alert);
    }

    @Transactional
    public FraudAlert createAlert(String claimId, String claimNumber, FraudAlert.Severity severity,
                                   String type, String description, List<String> indicators) {
        FraudAlert alert = new FraudAlert();
        alert.setClaimId(claimId);
        alert.setClaimNumber(claimNumber);
        alert.setSeverity(severity);
        alert.setType(type);
        alert.setDescription(description);
        alert.setIndicators(indicators);
        alert.setStatus(FraudAlert.AlertStatus.ACTIVE);
        return fraudAlertRepository.save(alert);
    }
}