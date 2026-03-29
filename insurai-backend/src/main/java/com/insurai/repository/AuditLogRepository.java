package com.insurai.repository;

import com.insurai.entity.AuditLog;
import com.insurai.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    
    List<AuditLog> findByUserId(String userId);
    
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, String entityId);
    
    List<AuditLog> findByUserRole(UserRole userRole);
    
    Page<AuditLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}