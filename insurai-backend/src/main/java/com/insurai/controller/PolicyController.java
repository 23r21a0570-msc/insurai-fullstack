package com.insurai.controller;

import com.insurai.dto.request.PolicyRequest;
import com.insurai.dto.response.ApiResponse;
import com.insurai.dto.response.PageResponse;
import com.insurai.dto.response.PolicyResponse;
import com.insurai.entity.PolicyStatus;
import com.insurai.service.PolicyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ANALYST')")
    public ResponseEntity<PageResponse<PolicyResponse>> getAllPolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<PolicyResponse> response = policyService.getAllPolicies(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PolicyResponse>> getPolicyById(@PathVariable String id) {
        PolicyResponse policy = policyService.getPolicyById(id);
        return ResponseEntity.ok(ApiResponse.success("Policy retrieved", policy));
    }

    @GetMapping("/number/{policyNumber}")
    public ResponseEntity<ApiResponse<PolicyResponse>> getPolicyByNumber(@PathVariable String policyNumber) {
        PolicyResponse policy = policyService.getPolicyByPolicyNumber(policyNumber);
        return ResponseEntity.ok(ApiResponse.success("Policy retrieved", policy));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ANALYST')")
    public ResponseEntity<PageResponse<PolicyResponse>> searchPolicies(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<PolicyResponse> response = policyService.searchPolicies(query, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ANALYST')")
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getPoliciesByStatus(@PathVariable PolicyStatus status) {
        List<PolicyResponse> policies = policyService.getPoliciesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved", policies));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PolicyResponse>> createPolicy(@Valid @RequestBody PolicyRequest request) {
        PolicyResponse policy = policyService.createPolicy(request);
        return ResponseEntity.ok(ApiResponse.success("Policy created successfully", policy));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PolicyResponse>> updatePolicy(
            @PathVariable String id,
            @Valid @RequestBody PolicyRequest request
    ) {
        PolicyResponse policy = policyService.updatePolicy(id, request);
        return ResponseEntity.ok(ApiResponse.success("Policy updated successfully", policy));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deletePolicy(@PathVariable String id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok(ApiResponse.success("Policy deleted successfully", null));
    }
}