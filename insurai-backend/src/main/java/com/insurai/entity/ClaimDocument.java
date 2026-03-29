package com.insurai.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "claim_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimDocument {

    @Id
    private String id;

    private String claimId;

    private String name;

    private String type;  // MIME type (e.g., application/pdf)

    private Long size;    // Size in bytes

    private String url;   // Storage URL (S3 or local path)

    private LocalDateTime uploadedAt;

    private String uploadedBy;

    // File metadata
    private String originalFileName;
    private String fileExtension;
    private String storageProvider; // "local" or "s3"

    // Document analysis (from Apache Tika)
    private String extractedText;
    private Boolean analyzed = false;
}