package com.insurai.controller;

import com.insurai.dto.request.ContactRequest;
import com.insurai.dto.request.DemoRequest;
import com.insurai.dto.request.NewsletterRequest;
import com.insurai.dto.response.ApiResponse;
import com.insurai.entity.ContactSubmission;
import com.insurai.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/landing")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final ContactService contactService;

    // ================================================================
    // PUBLIC ENDPOINTS (No auth required - landing page forms)
    // ================================================================

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<ContactSubmission>> submitContact(
            @Valid @RequestBody ContactRequest request
    ) {
        log.info("Contact form submission from: {}", request.getEmail());
        ContactSubmission submission = contactService.submitContact(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Thank you! We'll get back to you within 24 hours.",
                submission
        ));
    }

    @PostMapping("/newsletter")
    public ResponseEntity<ApiResponse<ContactSubmission>> subscribeNewsletter(
            @Valid @RequestBody NewsletterRequest request
    ) {
        log.info("Newsletter subscription: {}", request.getEmail());
        ContactSubmission submission = contactService.subscribeNewsletter(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Successfully subscribed to our newsletter!",
                submission
        ));
    }

    @PostMapping("/demo")
    public ResponseEntity<ApiResponse<ContactSubmission>> requestDemo(
            @Valid @RequestBody DemoRequest request
    ) {
        log.info("Demo request from: {}", request.getEmail());
        ContactSubmission submission = contactService.requestDemo(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Demo request received! Our team will contact you shortly.",
                submission
        ));
    }

    // ================================================================
    // ADMIN ENDPOINTS (Auth required - manage submissions)
    // ================================================================

    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<List<ContactSubmission>>> getAllSubmissions() {
        List<ContactSubmission> submissions = contactService.getAllSubmissions();
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", submissions));
    }

    @GetMapping("/submissions/type/{type}")
    public ResponseEntity<ApiResponse<List<ContactSubmission>>> getByType(@PathVariable String type) {
        List<ContactSubmission> submissions = contactService.getByType(type);
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", submissions));
    }

    @GetMapping("/submissions/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getNewCount() {
        long count = contactService.getNewCount();
        return ResponseEntity.ok(ApiResponse.success("Count retrieved", Map.of("newCount", count)));
    }
}