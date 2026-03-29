package com.insurai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimNoteRequest {

    @NotBlank(message = "Content is required")
    @Size(min = 5, message = "Note must be at least 5 characters")
    private String content;
}