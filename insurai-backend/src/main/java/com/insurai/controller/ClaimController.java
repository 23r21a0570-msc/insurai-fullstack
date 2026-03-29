package com.insurai.controller;

import com.insurai.dto.request.ClaimRequest;
import com.insurai.dto.response.ApiResponse;
import com.insurai.dto.response.ClaimResponse;
import com.insurai.dto.response.PageResponse;
import com.insurai.entity.ClaimStatus;
import com.insurai.service.ClaimService;
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
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ANALYST', 'AGENT')")
    public ResponseEntity<PageResponse<ClaimResponse>> getAllClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<ClaimResponse> response = claimService.getAllClaims(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponse>> getClaimById(@PathVariable String id) {
        ClaimResponse claim = claimService.getClaimById(id);
        return ResponseEntity.ok(ApiResponse.success("Claim retrieved", claim));
    }

    @GetMapping("/number/{claimNumber}")
    public ResponseEntity<ApiResponse<ClaimResponse>> getClaimByNumber(@PathVariable String claimNumber) {
        ClaimResponse claim = claimService.getClaimByClaimNumber(claimNumber);
        return ResponseEntity.ok(ApiResponse.success("Claim retrieved", claim));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ANALYST', 'AGENT')")
    public ResponseEntity<PageResponse<ClaimResponse>> searchClaims(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ClaimResponse> response = claimService.searchClaims(query, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ANALYST', 'AGENT')")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getClaimsByStatus(@PathVariable ClaimStatus status) {
        List<ClaimResponse> claims = claimService.getClaimsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved", claims));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponse>> createClaim(@Valid @RequestBody ClaimRequest request) {
        ClaimResponse claim = claimService.createClaim(request);
        return ResponseEntity.ok(ApiResponse.success("Claim created successfully", claim));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> updateClaimStatus(
            @PathVariable String id,
            @RequestParam ClaimStatus status,
            @RequestParam(required = false) String reason
    ) {
        ClaimResponse claim = claimService.updateClaimStatus(id, status, reason);
        return ResponseEntity.ok(ApiResponse.success("Claim status updated", claim));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<String>> assignClaim(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestParam String userName
    ) {
        claimService.assignClaim(id, userId, userName);
        return ResponseEntity.ok(ApiResponse.success("Claim assigned successfully", null));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> approveClaim(@PathVariable String id) {
        ClaimResponse claim = claimService.updateClaimStatus(id, ClaimStatus.APPROVED, null);
        return ResponseEntity.ok(ApiResponse.success("Claim approved", claim));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> rejectClaim(
            @PathVariable String id,
            @RequestParam String reason
    ) {
        ClaimResponse claim = claimService.updateClaimStatus(id, ClaimStatus.REJECTED, reason);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected", claim));
    }
}