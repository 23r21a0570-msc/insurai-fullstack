package com.insurai.service;

import com.insurai.dto.request.PolicyRuleRequest;
import com.insurai.entity.PolicyRule;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.PolicyRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PolicyRuleService {

    @Autowired
    private PolicyRuleRepository policyRuleRepository;

    public List<PolicyRule> getAllRules() {
        return policyRuleRepository.findAll();
    }

    public List<PolicyRule> getActiveRules() {
        return policyRuleRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Transactional
    public PolicyRule createRule(PolicyRuleRequest request) {
        PolicyRule rule = new PolicyRule();
        rule.setName(request.getName());
        rule.setDescription(request.getDescription());
        rule.setThreshold(request.getThreshold());
        rule.setAction(request.getAction());
        rule.setClaimType(request.getClaimType());
        rule.setIsActive(true);
        return policyRuleRepository.save(rule);
    }

    @Transactional
    public PolicyRule updateRule(String id, PolicyRuleRequest request) {
        PolicyRule rule = policyRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PolicyRule", "id", id));
        rule.setName(request.getName());
        rule.setDescription(request.getDescription());
        rule.setThreshold(request.getThreshold());
        rule.setAction(request.getAction());
        rule.setClaimType(request.getClaimType());
        return policyRuleRepository.save(rule);
    }

    @Transactional
    public PolicyRule toggleRule(String id) {
        PolicyRule rule = policyRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PolicyRule", "id", id));
        rule.setIsActive(!rule.getIsActive());
        return policyRuleRepository.save(rule);
    }

    @Transactional
    public void deleteRule(String id) {
        PolicyRule rule = policyRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PolicyRule", "id", id));
        policyRuleRepository.delete(rule);
    }
}