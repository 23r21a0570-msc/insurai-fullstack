package com.insurai.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.insurai.repository")
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB configuration
    // Additional beans can be added here if needed
}