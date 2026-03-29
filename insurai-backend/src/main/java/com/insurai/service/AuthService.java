package com.insurai.service;

import com.insurai.dto.request.ForgotPasswordRequest;
import com.insurai.dto.request.LoginRequest;
import com.insurai.dto.request.RegisterRequest;
import com.insurai.dto.response.ApiResponse;
import com.insurai.dto.response.AuthResponse;
import com.insurai.entity.User;
import com.insurai.entity.UserRole;
import com.insurai.exception.UnauthorizedException;
import com.insurai.exception.ValidationException;
import com.insurai.repository.UserRepository;
import com.insurai.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = tokenProvider.generateToken(authentication);

        // Get user details
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Build response
        AuthResponse.UserDTO userDTO = AuthResponse.UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .department(user.getDepartment())
                .isActive(user.getIsActive())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    @Transactional
    public ApiResponse<String> register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.CUSTOMER);
        user.setDepartment(request.getDepartment());
        user.setIsActive(request.getRole() == UserRole.CUSTOMER); // Auto-activate customers

        userRepository.save(user);

        String message = user.getRole() == UserRole.CUSTOMER
                ? "Account created successfully. You can now sign in."
                : "Registration request submitted. Awaiting admin approval.";

        return ApiResponse.success(message, null);
    }

    @Transactional
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user != null) {
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
            userRepository.save(user);

            // TODO: Send email with reset link
            // emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        }

        // Always return success for security (don't reveal if email exists)
        return ApiResponse.success("If an account exists, a password reset link has been sent.", null);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
}