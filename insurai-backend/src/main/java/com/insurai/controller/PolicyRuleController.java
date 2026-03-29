package com.insurai.controller;

import com.insurai.dto.request.PolicyRuleRequest;
import com.insurai.dto.response.ApiResponse;
import com.insurai.entity.PolicyRule;
import com.insurai.service.PolicyRuleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policy-rules")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class PolicyRuleController {

    @Autowired
    private PolicyRuleService policyRuleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PolicyRule>>> getAllRules() {
        List<PolicyRule> rules = policyRuleService.getAllRules();
        return ResponseEntity.ok(ApiResponse.success("Rules retrieved", rules));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<PolicyRule>>> getActiveRules() {
        List<PolicyRule> rules = policyRuleService.getActiveRules();
        return ResponseEntity.ok(ApiResponse.success("Active rules retrieved", rules));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PolicyRule>> createRule(@Valid @RequestBody PolicyRuleRequest request) {
        PolicyRule rule = policyRuleService.createRule(request);
        return ResponseEntity.ok(ApiResponse.success("Rule created", rule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PolicyRule>> updateRule(@PathVariable String id, @Valid @RequestBody PolicyRuleRequest request) {
        PolicyRule rule = policyRuleService.updateRule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Rule updated", rule));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<PolicyRule>> toggleRule(@PathVariable String id) {
        PolicyRule rule = policyRuleService.toggleRule(id);
        return ResponseEntity.ok(ApiResponse.success("Rule toggled", rule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRule(@PathVariable String id) {
        policyRuleService.deleteRule(id);
        return ResponseEntity.ok(ApiResponse.success("Rule deleted", null));
    }
}