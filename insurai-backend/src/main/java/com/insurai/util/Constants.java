package com.insurai.util;

public class Constants {

    // Authentication
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 15;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";
    
    // Claim Number Format
    public static final String CLAIM_NUMBER_PREFIX = "CLM-2024-";
    public static final String POLICY_NUMBER_PREFIX = "POL-";
    
    // AI Model
    public static final String AI_MODEL_VERSION = "v2.4.1";
    public static final int FRAUD_THRESHOLD = 70;
    public static final int RISK_THRESHOLD_CRITICAL = 80;
    public static final int RISK_THRESHOLD_HIGH = 60;
    public static final int RISK_THRESHOLD_MEDIUM = 40;
    
    // File Upload
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final String[] ALLOWED_FILE_TYPES = {
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/zip"
    };
    
    // Email Templates
    public static final String EMAIL_CLAIM_APPROVED = "claim_approved";
    public static final String EMAIL_CLAIM_REJECTED = "claim_rejected";
    public static final String EMAIL_PASSWORD_RESET = "password_reset";
    public static final String EMAIL_WELCOME = "welcome";
    
    // Cache Keys
    public static final String CACHE_DASHBOARD_STATS = "dashboard_stats";
    public static final String CACHE_USER_PREFIX = "user_";
    public static final String CACHE_CLAIM_PREFIX = "claim_";
    public static final String CACHE_POLICY_PREFIX = "policy_";
    
    // Roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_MANAGER = "MANAGER";
    public static final String ROLE_ANALYST = "ANALYST";
    public static final String ROLE_AGENT = "AGENT";
    public static final String ROLE_CUSTOMER = "CUSTOMER";

    private Constants() {
        // Private constructor to prevent instantiation
    }
}