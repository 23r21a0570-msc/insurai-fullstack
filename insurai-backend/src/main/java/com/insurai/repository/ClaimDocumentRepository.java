package com.insurai.repository;

import com.insurai.entity.ClaimDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimDocumentRepository extends MongoRepository<ClaimDocument, String> {
    
    List<ClaimDocument> findByClaimId(String claimId);
    
    List<ClaimDocument> findByClaimIdOrderByUploadedAtDesc(String claimId);
    
    List<ClaimDocument> findByUploadedBy(String uploadedBy);
    
    Long countByClaimId(String claimId);
}