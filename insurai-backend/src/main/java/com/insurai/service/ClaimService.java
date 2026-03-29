package com.insurai.service;

import com.insurai.dto.request.ClaimRequest;
import com.insurai.dto.response.ClaimResponse;
import com.insurai.dto.response.PageResponse;
import com.insurai.entity.*;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.ClaimRepository;
import com.insurai.repository.ClaimTimelineEventRepository;
import com.insurai.util.ClaimNumberGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ClaimTimelineEventRepository timelineEventRepository;

    @Transactional(readOnly = true)
    public PageResponse<ClaimResponse> getAllClaims(Pageable pageable) {
        Page<Claim> claimPage = claimRepository.findAll(pageable);
        return mapToPageResponse(claimPage);
    }

    @Transactional(readOnly = true)
    public ClaimResponse getClaimById(String id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        return mapToResponse(claim);
    }

    @Transactional(readOnly = true)
    public ClaimResponse getClaimByClaimNumber(String claimNumber) {
        Claim claim = claimRepository.findByClaimNumber(claimNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "claimNumber", claimNumber));
        return mapToResponse(claim);
    }

    @Transactional(readOnly = true)
    public PageResponse<ClaimResponse> searchClaims(String search, Pageable pageable) {
        Page<Claim> claimPage = claimRepository.searchClaims(search, pageable);
        return mapToPageResponse(claimPage);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getClaimsByStatus(ClaimStatus status) {
        return claimRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimResponse createClaim(ClaimRequest request) {
        Claim claim = new Claim();
        claim.setClaimNumber(ClaimNumberGenerator.generate());
        claim.setPolicyNumber(request.getPolicyNumber());
        
        Claimant claimant = new Claimant();
        claimant.setClaimantName(request.getClaimantName());
        claimant.setClaimantEmail(request.getClaimantEmail());
        claimant.setClaimantPhone(request.getClaimantPhone());
        claim.setClaimant(claimant);
        
        claim.setType(request.getType());
        claim.setDescription(request.getDescription());
        claim.setAmount(request.getAmount());
        claim.setStatus(ClaimStatus.SUBMITTED);
        claim.setIncidentDate(request.getIncidentDate());
        claim.setIncidentLocation(request.getIncidentLocation());

        Claim savedClaim = claimRepository.save(claim);

        // Create timeline event
        createTimelineEvent(savedClaim.getId(), ClaimTimelineEvent.EventType.STATUS_CHANGE,
                "Claim Submitted", "Claim submitted by policyholder", "System");

        return mapToResponse(savedClaim);
    }

    @Transactional
    public ClaimResponse updateClaimStatus(String id, ClaimStatus newStatus, String reason) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        ClaimStatus oldStatus = claim.getStatus();
        claim.setStatus(newStatus);
        claim.setUpdatedAt(LocalDateTime.now());

        if (newStatus == ClaimStatus.REJECTED) {
            claim.setRejectionReason(reason);
            claim.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == ClaimStatus.APPROVED) {
            claim.setResolvedAt(LocalDateTime.now());
        }

        Claim updatedClaim = claimRepository.save(claim);

        // Create timeline event
        createTimelineEvent(claim.getId(), ClaimTimelineEvent.EventType.STATUS_CHANGE,
                "Status Changed", String.format("Status changed from %s to %s", oldStatus, newStatus), "System");

        return mapToResponse(updatedClaim);
    }

    @Transactional
    public void assignClaim(String claimId, String userId, String userName) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", claimId));

        claim.setAssignedToName(userName);
        claimRepository.save(claim);

        createTimelineEvent(claimId, ClaimTimelineEvent.EventType.ASSIGNED,
                "Claim Assigned", "Claim assigned to " + userName, "System");
    }

    private void createTimelineEvent(String claimId, ClaimTimelineEvent.EventType type,
                                      String title, String description, String userName) {
        ClaimTimelineEvent event = new ClaimTimelineEvent();
        event.setClaimId(claimId);
        event.setType(type);
        event.setTitle(title);
        event.setDescription(description);
        event.setTimestamp(LocalDateTime.now());
        event.setUserName(userName);
        timelineEventRepository.save(event);
    }

    private ClaimResponse mapToResponse(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId())
                .claimNumber(claim.getClaimNumber())
                .policyNumber(claim.getPolicyNumber())
                .claimant(ClaimResponse.ClaimantDTO.builder()
                        .name(claim.getClaimant() != null ? claim.getClaimant().getClaimantName() : null)
                        .email(claim.getClaimant() != null ? claim.getClaimant().getClaimantEmail() : null)
                        .phone(claim.getClaimant() != null ? claim.getClaimant().getClaimantPhone() : null)
                        .build())
                .type(claim.getType())
                .description(claim.getDescription())
                .amount(claim.getAmount())
                .status(claim.getStatus())
                .riskScore(claim.getRiskScore())
                .riskLevel(claim.getRiskLevel())
                .fraudProbability(claim.getFraudProbability())
                .submittedAt(claim.getSubmittedAt())
                .updatedAt(claim.getUpdatedAt())
                .assignedToName(claim.getAssignedToName())
                .documentIds(claim.getDocumentIds() != null ? new ArrayList<>(claim.getDocumentIds()) : new ArrayList<>())
                .timelineEventIds(claim.getTimelineEventIds() != null ? new ArrayList<>(claim.getTimelineEventIds()) : new ArrayList<>())
                .build();
    }

    private PageResponse<ClaimResponse> mapToPageResponse(Page<Claim> page) {
        return PageResponse.<ClaimResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public Long countByStatus(ClaimStatus status) {
        return claimRepository.countByStatus(status);
    }

    public Long countHighRiskClaims() {
        return claimRepository.countHighRiskClaims();
    }
}