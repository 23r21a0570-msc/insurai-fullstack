package com.insurai.repository;

import com.insurai.entity.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, String> {

    List<ContactSubmission> findByTypeOrderByCreatedAtDesc(String type);

    List<ContactSubmission> findByStatusOrderByCreatedAtDesc(String status);

    List<ContactSubmission> findByEmailOrderByCreatedAtDesc(String email);

    List<ContactSubmission> findAllByOrderByCreatedAtDesc();

    long countByStatus(String status);

    boolean existsByEmailAndType(String email, String type);
}