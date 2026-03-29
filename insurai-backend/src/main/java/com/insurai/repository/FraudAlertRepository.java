package com.insurai.repository;

import com.insurai.entity.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, String> {
    
    List<FraudAlert> findByClaimId(String claimId);
    
    List<FraudAlert> findByStatus(FraudAlert.AlertStatus status);
    
    List<FraudAlert> findBySeverity(FraudAlert.Severity severity);
    
    List<FraudAlert> findByStatusOrderByDetectedAtDesc(FraudAlert.AlertStatus status);
}