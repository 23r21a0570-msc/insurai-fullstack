package com.insurai.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claimant {
    
    private String claimantName;
    
    private String claimantEmail;
    
    private String claimantPhone;
}