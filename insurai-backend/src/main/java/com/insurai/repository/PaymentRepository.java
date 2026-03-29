package com.insurai.repository;

import com.insurai.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    
    List<Payment> findByPolicyNumber(String policyNumber);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByPolicy_Id(String policyId);
    
    @Query("SELECT p FROM Payment p WHERE p.dueDate BETWEEN :startDate AND :endDate AND p.status = 'UPCOMING'")
    List<Payment> findUpcomingPayments(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.dueDate < :currentDate AND p.status = 'UPCOMING'")
    List<Payment> findOverduePayments(@Param("currentDate") LocalDate currentDate);
}