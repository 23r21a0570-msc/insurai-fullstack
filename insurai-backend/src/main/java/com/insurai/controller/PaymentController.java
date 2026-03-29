package com.insurai.controller;

import com.insurai.dto.response.ApiResponse;
import com.insurai.entity.Payment;
import com.insurai.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", payments));
    }

    @GetMapping("/policy/{policyNumber}")
    public ResponseEntity<ApiResponse<List<Payment>>> getByPolicy(@PathVariable String policyNumber) {
        List<Payment> payments = paymentService.getPaymentsByPolicyNumber(policyNumber);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", payments));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<Payment>>> getUpcoming() {
        List<Payment> payments = paymentService.getUpcomingPayments();
        return ResponseEntity.ok(ApiResponse.success("Upcoming payments", payments));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Payment>>> getOverdue() {
        List<Payment> payments = paymentService.getOverduePayments();
        return ResponseEntity.ok(ApiResponse.success("Overdue payments", payments));
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<ApiResponse<Payment>> processPayment(@PathVariable String id) {
        Payment payment = paymentService.processPayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment processed", payment));
    }
}