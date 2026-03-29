package com.insurai.repository;

import com.insurai.entity.PolicyRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRuleRepository extends JpaRepository<PolicyRule, String> {
    
    List<PolicyRule> findByIsActive(Boolean isActive);
    
    List<PolicyRule> findByClaimType(String claimType);
    
    List<PolicyRule> findByIsActiveTrueOrderByCreatedAtDesc();
}