package com.insurai.service;

import com.insurai.entity.Payment;
import com.insurai.exception.ResourceNotFoundException;
import com.insurai.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getPaymentsByPolicyNumber(String policyNumber) {
        return paymentRepository.findByPolicyNumber(policyNumber);
    }

    public List<Payment> getUpcomingPayments() {
        return paymentRepository.findUpcomingPayments(LocalDate.now(), LocalDate.now().plusDays(30));
    }

    public List<Payment> getOverduePayments() {
        return paymentRepository.findOverduePayments(LocalDate.now());
    }

    @Transactional
    public Payment processPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setPaymentMethod("Credit Card");
        payment.setTransactionId("TXN-" + System.currentTimeMillis());
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}