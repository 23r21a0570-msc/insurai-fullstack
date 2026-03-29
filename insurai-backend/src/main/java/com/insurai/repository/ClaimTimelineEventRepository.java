package com.insurai.repository;

import com.insurai.entity.ClaimTimelineEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimTimelineEventRepository extends MongoRepository<ClaimTimelineEvent, String> {
    
    List<ClaimTimelineEvent> findByClaimIdOrderByTimestampDesc(String claimId);
    
    List<ClaimTimelineEvent> findByClaimIdOrderByTimestampAsc(String claimId);
    
    List<ClaimTimelineEvent> findByType(ClaimTimelineEvent.EventType type);
    
    List<ClaimTimelineEvent> findByUserId(String userId);
}