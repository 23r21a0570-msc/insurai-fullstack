package com.insurai.entity;

/**
 * User role enumeration matching frontend roles
 */
public enum UserRole {
    ADMIN,      // Full system access
    MANAGER,    // Claims approval, user assignment
    ANALYST,    // Claims review, AI override
    AGENT,      // Claims processing, notes
    CUSTOMER    // Own policies, claims, payments
}