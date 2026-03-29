package com.insurai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InsuraiApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuraiApplication.class, args);
        System.out.println("\n" +
                "═══════════════════════════════════════════════════════════\n" +
                "   INSURAI Backend - AI-Powered Insurance Platform\n" +
                "═══════════════════════════════════════════════════════════\n" +
                "   Server running at: http://localhost:8080\n" +
                "   Swagger UI: http://localhost:8080/swagger-ui.html\n" +
                "   API Docs: http://localhost:8080/api-docs\n" +
                "═══════════════════════════════════════════════════════════\n");
    }
}