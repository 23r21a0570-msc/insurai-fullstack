package com.insurai.service;

import com.insurai.dto.request.PolicyRequest;
import com.insurai.dto.response.PageResponse;
import com.insurai.dto.response.PolicyResponse;
import com.insurai.entity.Policy;
import com.insurai.entity.PolicyStatus;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    public PageResponse<PolicyResponse> getAllPolicies(Pageable pageable) {
        Page<Policy> policyPage = policyRepository.findAll(pageable);
        return mapToPageResponse(policyPage);
    }

    public PolicyResponse getPolicyById(String id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "id", id));
        return mapToResponse(policy);
    }

    public PolicyResponse getPolicyByPolicyNumber(String policyNumber) {
        Policy policy = policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "policyNumber", policyNumber));
        return mapToResponse(policy);
    }

    public PageResponse<PolicyResponse> searchPolicies(String search, Pageable pageable) {
        Page<Policy> policyPage = policyRepository.searchPolicies(search, pageable);
        return mapToPageResponse(policyPage);
    }

    public List<PolicyResponse> getPoliciesByStatus(PolicyStatus status) {
        return policyRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PolicyResponse createPolicy(PolicyRequest request) {
        Policy policy = new Policy();
        policy.setPolicyNumber(generatePolicyNumber());
        policy.setType(request.getType());
        policy.setHolderName(request.getHolderName());
        policy.setHolderEmail(request.getHolderEmail());
        policy.setHolderPhone(request.getHolderPhone());
        policy.setCoverageAmount(request.getCoverageAmount());
        policy.setPremium(request.getPremium());
        policy.setDeductible(request.getDeductible());
        policy.setStartDate(request.getStartDate());
        policy.setEndDate(request.getEndDate());
        policy.setStatus(PolicyStatus.PENDING);
        policy.setClaimsCount(0);
        policy.setTotalClaimsAmount(BigDecimal.ZERO);

        Policy savedPolicy = policyRepository.save(policy);
        return mapToResponse(savedPolicy);
    }

    @Transactional
    public PolicyResponse updatePolicy(String id, PolicyRequest request) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "id", id));

        policy.setHolderName(request.getHolderName());
        policy.setHolderEmail(request.getHolderEmail());
        policy.setHolderPhone(request.getHolderPhone());
        policy.setCoverageAmount(request.getCoverageAmount());
        policy.setPremium(request.getPremium());
        policy.setDeductible(request.getDeductible());
        policy.setEndDate(request.getEndDate());

        Policy updatedPolicy = policyRepository.save(policy);
        return mapToResponse(updatedPolicy);
    }

    @Transactional
    public void deletePolicy(String id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "id", id));
        policyRepository.delete(policy);
    }

    private String generatePolicyNumber() {
        return "POL-" + (int)(Math.random() * 9000 + 1000);
    }

    private PolicyResponse mapToResponse(Policy policy) {
        return PolicyResponse.builder()
                .id(policy.getId())
                .policyNumber(policy.getPolicyNumber())
                .type(policy.getType())
                .holderName(policy.getHolderName())
                .holderEmail(policy.getHolderEmail())
                .holderPhone(policy.getHolderPhone())
                .coverageAmount(policy.getCoverageAmount())
                .premium(policy.getPremium())
                .deductible(policy.getDeductible())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .status(policy.getStatus())
                .claimsCount(policy.getClaimsCount())
                .totalClaimsAmount(policy.getTotalClaimsAmount())
                .nextPaymentDate(policy.getNextPaymentDate())
                .nextPaymentAmount(policy.getNextPaymentAmount())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }

    private PageResponse<PolicyResponse> mapToPageResponse(Page<Policy> page) {
        return PageResponse.<PolicyResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}