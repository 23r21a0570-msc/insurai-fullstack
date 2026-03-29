package com.insurai.dto.response;

import com.insurai.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String email;
    private String name;
    private UserRole role;
    private String avatar;
    private String department;
    private Boolean isActive;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}