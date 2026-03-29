package com.insurai.service;

import com.insurai.dto.request.ContactRequest;
import com.insurai.dto.request.DemoRequest;
import com.insurai.dto.request.NewsletterRequest;
import com.insurai.entity.ContactSubmission;
import com.insurai.repository.ContactSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactSubmissionRepository contactRepository;

    // --- Contact Form ---
    public ContactSubmission submitContact(ContactRequest request) {
        log.info("New contact form submission from: {}", request.getEmail());

        ContactSubmission submission = ContactSubmission.builder()
                .name(request.getName())
                .email(request.getEmail())
                .company(request.getCompany())
                .phone(request.getPhone())
                .message(request.getMessage())
                .type("contact_" + request.getType())
                .status("new")
                .build();

        return contactRepository.save(submission);
    }

    // --- Newsletter ---
    public ContactSubmission subscribeNewsletter(NewsletterRequest request) {
        log.info("New newsletter subscription: {}", request.getEmail());

        // Check if already subscribed
        if (contactRepository.existsByEmailAndType(request.getEmail(), "newsletter")) {
            log.info("Email already subscribed: {}", request.getEmail());
            // Return existing - don't throw error
            return contactRepository.findByEmailOrderByCreatedAtDesc(request.getEmail())
                    .stream()
                    .filter(s -> s.getType().equals("newsletter"))
                    .findFirst()
                    .orElse(null);
        }

        ContactSubmission submission = ContactSubmission.builder()
                .name("")
                .email(request.getEmail())
                .type("newsletter")
                .status("subscribed")
                .build();

        return contactRepository.save(submission);
    }

    // --- Demo Request ---
    public ContactSubmission requestDemo(DemoRequest request) {
        log.info("New demo request from: {} at {}", request.getName(), request.getCompany());

        ContactSubmission submission = ContactSubmission.builder()
                .name(request.getName())
                .email(request.getEmail())
                .company(request.getCompany())
                .phone(request.getPhone())
                .message(request.getMessage())
                .type("demo")
                .status("new")
                .build();

        return contactRepository.save(submission);
    }

    // --- Admin Methods ---
    public List<ContactSubmission> getAllSubmissions() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<ContactSubmission> getByType(String type) {
        return contactRepository.findByTypeOrderByCreatedAtDesc(type);
    }

    public List<ContactSubmission> getByStatus(String status) {
        return contactRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public long getNewCount() {
        return contactRepository.countByStatus("new");
    }
}