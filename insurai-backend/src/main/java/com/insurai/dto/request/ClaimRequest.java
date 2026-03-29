package com.insurai.dto.request;

import com.insurai.entity.ClaimType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimRequest {

    @NotBlank(message = "Policy number is required")
    private String policyNumber;

    // Claimant details
    @NotBlank(message = "Claimant name is required")
    private String claimantName;

    @NotBlank(message = "Claimant email is required")
    @Email(message = "Invalid email format")
    private String claimantEmail;

    @NotBlank(message = "Claimant phone is required")
    private String claimantPhone;

    @NotNull(message = "Claim type is required")
    private ClaimType type;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotNull(message = "Claim amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private LocalDateTime incidentDate;

    private String incidentLocation;
}