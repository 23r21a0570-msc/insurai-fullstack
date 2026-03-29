package com.insurai.dto.request;

import com.insurai.entity.PolicyType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyRequest {

    @NotNull(message = "Policy type is required")
    private PolicyType type;

    @NotBlank(message = "Holder name is required")
    private String holderName;

    @NotBlank(message = "Holder email is required")
    @Email(message = "Invalid email format")
    private String holderEmail;

    private String holderPhone;

    @NotNull(message = "Coverage amount is required")
    @DecimalMin(value = "1000", message = "Coverage must be at least 1000")
    private BigDecimal coverageAmount;

    @NotNull(message = "Premium is required")
    @DecimalMin(value = "100", message = "Premium must be at least 100")
    private BigDecimal premium;

    @NotNull(message = "Deductible is required")
    @DecimalMin(value = "0", message = "Deductible must be positive")
    private BigDecimal deductible;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}