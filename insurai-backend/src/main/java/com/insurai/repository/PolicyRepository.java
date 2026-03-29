package com.insurai.repository;

import com.insurai.entity.Policy;
import com.insurai.entity.PolicyStatus;
import com.insurai.entity.PolicyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, String> {
    
    Optional<Policy> findByPolicyNumber(String policyNumber);
    
    List<Policy> findByStatus(PolicyStatus status);
    
    List<Policy> findByType(PolicyType type);
    
    List<Policy> findByCustomer_Id(String customerId);
    
    @Query("SELECT p FROM Policy p WHERE p.holderName LIKE %:search% OR p.policyNumber LIKE %:search%")
    Page<Policy> searchPolicies(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT p FROM Policy p WHERE p.endDate BETWEEN :startDate AND :endDate AND p.status = 'ACTIVE'")
    List<Policy> findExpiringPolicies(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    Long countByStatus(PolicyStatus status);
}