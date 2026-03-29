package com.insurai.controller;

import com.insurai.dto.response.ApiResponse;
import com.insurai.entity.*;
import com.insurai.repository.*;
import com.insurai.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        User user = authService.getCurrentUser();
        
        List<Policy> policies = policyRepository.findByCustomer_Id(user.getId());
        long activePolicies = policies.stream().filter(p -> p.getStatus() == PolicyStatus.ACTIVE).count();
        
        List<String> policyNumbers = policies.stream().map(Policy::getPolicyNumber).toList();
        
        long pendingClaims = 0;
        long totalClaims = 0;
        for (String policyNumber : policyNumbers) {
            List<Claim> claims = claimRepository.findByPolicyNumber(policyNumber);
            totalClaims += claims.size();
            pendingClaims += claims.stream()
                    .filter(c -> c.getStatus() == ClaimStatus.SUBMITTED || 
                                 c.getStatus() == ClaimStatus.UNDER_REVIEW || 
                                 c.getStatus() == ClaimStatus.PENDING_INFO)
                    .count();
        }
        
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("activePolicies", activePolicies);
        dashboard.put("totalPolicies", policies.size());
        dashboard.put("pendingClaims", pendingClaims);
        dashboard.put("totalClaims", totalClaims);
        
        return ResponseEntity.ok(ApiResponse.success("Customer dashboard", dashboard));
    }

    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<List<Policy>>> getMyPolicies() {
        User user = authService.getCurrentUser();
        List<Policy> policies = policyRepository.findByCustomer_Id(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Customer policies", policies));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse<List<Claim>>> getMyClaims() {
        User user = authService.getCurrentUser();
        List<Policy> policies = policyRepository.findByCustomer_Id(user.getId());
        List<String> policyNumbers = policies.stream().map(Policy::getPolicyNumber).toList();
        
        List<Claim> allClaims = new java.util.ArrayList<>();
        for (String policyNumber : policyNumbers) {
            allClaims.addAll(claimRepository.findByPolicyNumber(policyNumber));
        }
        
        return ResponseEntity.ok(ApiResponse.success("Customer claims", allClaims));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getMyPayments() {
        User user = authService.getCurrentUser();
        List<Policy> policies = policyRepository.findByCustomer_Id(user.getId());
        List<String> policyNumbers = policies.stream().map(Policy::getPolicyNumber).toList();
        
        List<Payment> allPayments = new java.util.ArrayList<>();
        for (String policyNumber : policyNumbers) {
            allPayments.addAll(paymentRepository.findByPolicyNumber(policyNumber));
        }
        
        return ResponseEntity.ok(ApiResponse.success("Customer payments", allPayments));
    }
}