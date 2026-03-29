package com.insurai.dto.request;

import com.insurai.entity.PolicyRule;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyRuleRequest {

    @NotBlank(message = "Rule name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Threshold is required")
    @Min(value = 0, message = "Threshold must be positive")
    private Integer threshold;

    @NotNull(message = "Action is required")
    private PolicyRule.RuleAction action;

    private String claimType; // Optional
}