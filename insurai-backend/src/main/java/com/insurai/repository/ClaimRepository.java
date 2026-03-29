package com.insurai.repository;

import com.insurai.entity.Claim;
import com.insurai.entity.ClaimStatus;
import com.insurai.entity.ClaimType;
import com.insurai.entity.RiskLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, String> {
    
    Optional<Claim> findByClaimNumber(String claimNumber);
    
    List<Claim> findByPolicyNumber(String policyNumber);
    
    List<Claim> findByStatus(ClaimStatus status);
    
    List<Claim> findByType(ClaimType type);
    
    List<Claim> findByRiskLevel(RiskLevel riskLevel);
    
    Page<Claim> findByStatusIn(List<ClaimStatus> statuses, Pageable pageable);
    
    Page<Claim> findByRiskLevelIn(List<RiskLevel> riskLevels, Pageable pageable);
    
    List<Claim> findByAssignedTo_Id(String userId);
    
    @Query("SELECT c FROM Claim c WHERE c.claimNumber LIKE %:search% OR c.claimant.claimantName LIKE %:search% OR c.policyNumber LIKE %:search%")
    Page<Claim> searchClaims(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT c FROM Claim c WHERE c.submittedAt BETWEEN :startDate AND :endDate")
    List<Claim> findClaimsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.status = :status")
    Long countByStatus(@Param("status") ClaimStatus status);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.riskLevel IN ('HIGH', 'CRITICAL')")
    Long countHighRiskClaims();
}