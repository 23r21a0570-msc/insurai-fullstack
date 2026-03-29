package com.insurai.repository;

import com.insurai.entity.ClaimNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimNoteRepository extends JpaRepository<ClaimNote, String> {
    
    List<ClaimNote> findByClaimIdOrderByCreatedAtDesc(String claimId);
    
    List<ClaimNote> findByAuthorId(String authorId);
}