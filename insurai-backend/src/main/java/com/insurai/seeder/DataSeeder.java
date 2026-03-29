package com.insurai.seeder;

import com.insurai.entity.*;
import com.insurai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ClaimTimelineEventRepository timelineEventRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Random random = new Random();
    private final Set<String> usedClaimNumbers = new HashSet<>();
    private final Set<String> usedPolicyNumbers = new HashSet<>();
    private final Set<String> usedEmails = new HashSet<>();
    private int claimCounter = 1001;
    private int policyCounter = 1001;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("✅ Database already seeded. Skipping...");
            return;
        }

        System.out.println("🌱 Starting database seeding...");

        List<User> users = seedUsers();
        List<Policy> policies = seedPolicies(users);
        List<Claim> claims = seedClaims(policies);
        seedPayments(policies);

        System.out.println("✅ Database seeding completed!");
        System.out.println("   - Users: " + users.size());
        System.out.println("   - Policies: " + policies.size());
        System.out.println("   - Claims: " + claims.size());
    }

    private String generateUniqueClaimNumber() {
        String number = "CLM-2026-" + String.format("%04d", claimCounter++);
        while (usedClaimNumbers.contains(number)) {
            number = "CLM-2026-" + String.format("%04d", claimCounter++);
        }
        usedClaimNumbers.add(number);
        return number;
    }

    private String generateUniquePolicyNumber() {
        String number = "POL-" + String.format("%04d", policyCounter++);
        while (usedPolicyNumbers.contains(number)) {
            number = "POL-" + String.format("%04d", policyCounter++);
        }
        usedPolicyNumbers.add(number);
        return number;
    }

    private String generateUniqueEmail(String firstName, String lastName) {
        String base = firstName.toLowerCase() + "." + lastName.toLowerCase();
        String email = base + "@gmail.com";
        int counter = 1;
        while (usedEmails.contains(email)) {
            email = base + counter + "@gmail.com";
            counter++;
        }
        usedEmails.add(email);
        return email;
    }

    // ═══════════════════════════════════════════════════════════
    // USERS
    // ═══════════════════════════════════════════════════════════
    private List<User> seedUsers() {
        List<User> users = new ArrayList<>();

        users.add(createUser("Super Admin", "admin@insurai.com", UserRole.ADMIN, "Administration", true));
        users.add(createUser("Sarah Chen", "sarah.chen@insurai.com", UserRole.MANAGER, "Claims Management", true));
        users.add(createUser("Mike Ross", "mike.ross@insurai.com", UserRole.ANALYST, "Risk Analysis", true));
        users.add(createUser("Emily Wang", "emily.wang@insurai.com", UserRole.ANALYST, "Fraud Detection", true));
        users.add(createUser("James Wilson", "james.wilson@insurai.com", UserRole.AGENT, "Claims Processing", true));
        users.add(createUser("Priya Patel", "priya.patel@insurai.com", UserRole.AGENT, "Claims Processing", true));

        String[] firstNames = {"John", "Jane", "Michael", "Sarah", "David", "Lisa", "Robert", "Maria",
                "William", "Jennifer", "Richard", "Patricia", "Charles", "Linda", "Thomas",
                "Barbara", "Daniel", "Elizabeth", "Matthew", "Susan"};
        String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson",
                "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris",
                "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark"};

        for (int i = 0; i < 50; i++) {
            String firstName = firstNames[i % firstNames.length];
            String lastName = lastNames[i % lastNames.length];
            String name = firstName + " " + lastName;
            String email = generateUniqueEmail(firstName, lastName);
            users.add(createUser(name, email, UserRole.CUSTOMER, null, true));
        }

        return userRepository.saveAll(users);
    }

    private User createUser(String name, String email, UserRole role, String department, boolean isActive) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(role);
        user.setDepartment(department);
        user.setIsActive(isActive);
        user.setPhone("+1" + (2000000000L + random.nextInt(100000000)));
        return user;
    }

    // ═══════════════════════════════════════════════════════════
    // POLICIES
    // ═══════════════════════════════════════════════════════════
    private List<Policy> seedPolicies(List<User> users) {
        List<Policy> policies = new ArrayList<>();
        List<User> customers = users.stream().filter(u -> u.getRole() == UserRole.CUSTOMER).toList();

        PolicyType[] types = PolicyType.values();

        for (User customer : customers) {
            int policyCount = random.nextInt(3) + 1;
            for (int i = 0; i < policyCount; i++) {
                PolicyType type = types[random.nextInt(types.length)];
                policies.add(createPolicy(customer, type));
            }
        }

        return policyRepository.saveAll(policies);
    }

    private Policy createPolicy(User customer, PolicyType type) {
        Policy policy = new Policy();
        policy.setPolicyNumber(generateUniquePolicyNumber());
        policy.setType(type);
        policy.setHolderName(customer.getName());
        policy.setHolderEmail(customer.getEmail());
        policy.setHolderPhone(customer.getPhone());
        policy.setCustomer(customer);

        switch (type) {
            case AUTO -> {
                policy.setCoverageAmount(new BigDecimal(50000 + random.nextInt(450000)));
                policy.setPremium(new BigDecimal(800 + random.nextInt(2200)));
                policy.setDeductible(new BigDecimal(500 + random.nextInt(2500)));
            }
            case HOME -> {
                policy.setCoverageAmount(new BigDecimal(200000 + random.nextInt(800000)));
                policy.setPremium(new BigDecimal(1500 + random.nextInt(3500)));
                policy.setDeductible(new BigDecimal(1000 + random.nextInt(4000)));
            }
            case HEALTH -> {
                policy.setCoverageAmount(new BigDecimal(50000 + random.nextInt(450000)));
                policy.setPremium(new BigDecimal(600 + random.nextInt(2400)));
                policy.setDeductible(new BigDecimal(500 + random.nextInt(2500)));
            }
            case LIFE -> {
                policy.setCoverageAmount(new BigDecimal(100000 + random.nextInt(900000)));
                policy.setPremium(new BigDecimal(300 + random.nextInt(1700)));
                policy.setDeductible(BigDecimal.ZERO);
            }
            case BUSINESS -> {
                policy.setCoverageAmount(new BigDecimal(500000 + random.nextInt(4500000)));
                policy.setPremium(new BigDecimal(3000 + random.nextInt(12000)));
                policy.setDeductible(new BigDecimal(2000 + random.nextInt(8000)));
            }
        }

        LocalDate startDate = LocalDate.now().minusDays(random.nextInt(730));
        policy.setStartDate(startDate);
        policy.setEndDate(startDate.plusYears(1));
        policy.setStatus(random.nextDouble() > 0.1 ? PolicyStatus.ACTIVE : PolicyStatus.PENDING);
        policy.setClaimsCount(0);
        policy.setTotalClaimsAmount(BigDecimal.ZERO);

        return policy;
    }

    // ═══════════════════════════════════════════════════════════
    // CLAIMS
    // ═══════════════════════════════════════════════════════════
    private List<Claim> seedClaims(List<Policy> policies) {
        List<Claim> claims = new ArrayList<>();
        ClaimType[] types = ClaimType.values();
        ClaimStatus[] statuses = ClaimStatus.values();

        List<Policy> activePolicies = policies.stream()
                .filter(p -> p.getStatus() == PolicyStatus.ACTIVE)
                .toList();

        for (Policy policy : activePolicies) {
            if (random.nextDouble() < 0.4) {
                int claimCount = random.nextInt(2) + 1;
                for (int i = 0; i < claimCount; i++) {
                    claims.add(createClaim(policy, types, statuses));
                }
            }
        }

        List<Claim> savedClaims = claimRepository.saveAll(claims);

        for (Claim claim : savedClaims) {
            ClaimTimelineEvent event = new ClaimTimelineEvent();
            event.setClaimId(claim.getId());
            event.setType(ClaimTimelineEvent.EventType.STATUS_CHANGE);
            event.setTitle("Claim Submitted");
            event.setDescription("Claim submitted by policyholder");
            event.setTimestamp(LocalDateTime.now());
            event.setUserName("System");
            timelineEventRepository.save(event);
        }

        return savedClaims;
    }

    private Claim createClaim(Policy policy, ClaimType[] types, ClaimStatus[] statuses) {
        Claim claim = new Claim();
        claim.setClaimNumber(generateUniqueClaimNumber());
        claim.setPolicyNumber(policy.getPolicyNumber());

        Claimant claimant = new Claimant();
        claimant.setClaimantName(policy.getHolderName());
        claimant.setClaimantEmail(policy.getHolderEmail());
        claimant.setClaimantPhone(policy.getHolderPhone());
        claim.setClaimant(claimant);

        claim.setType(types[random.nextInt(types.length)]);
        claim.setDescription(getRandomDescription(claim.getType()));
        claim.setAmount(new BigDecimal(1000 + random.nextInt(49000)));
        claim.setStatus(statuses[random.nextInt(statuses.length)]);

        int riskScore = random.nextInt(100);
        claim.setRiskScore(riskScore);
        claim.setRiskLevel(riskScore >= 80 ? RiskLevel.CRITICAL :
                riskScore >= 60 ? RiskLevel.HIGH :
                        riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW);
        claim.setFraudProbability(Math.min(riskScore + random.nextInt(15) - 7, 99));

        claim.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(90)));
        claim.setUpdatedAt(LocalDateTime.now().minusDays(random.nextInt(30)));

        return claim;
    }

    private String getRandomDescription(ClaimType type) {
        return switch (type) {
            case AUTO_COLLISION -> "Vehicle collision at intersection. Front bumper and hood damage reported.";
            case AUTO_THEFT -> "Vehicle theft from parking garage. Police report filed.";
            case PROPERTY_DAMAGE -> "Water damage from burst pipe. Kitchen flooring and cabinets affected.";
            case MEDICAL -> "Medical claim for emergency surgery following automobile accident.";
            case LIABILITY -> "Third party injury on insured property. Legal representation involved.";
            case NATURAL_DISASTER -> "Hail damage to roof. Multiple shingles damaged.";
        };
    }

    // ═══════════════════════════════════════════════════════════
    // PAYMENTS
    // ═══════════════════════════════════════════════════════════
    private void seedPayments(List<Policy> policies) {
        List<Payment> payments = new ArrayList<>();

        for (Policy policy : policies) {
            if (policy.getStatus() == PolicyStatus.ACTIVE) {
                Payment pastPayment = new Payment();
                pastPayment.setPolicyNumber(policy.getPolicyNumber());
                pastPayment.setPolicy(policy);
                pastPayment.setAmount(policy.getPremium());
                pastPayment.setDueDate(LocalDate.now().minusMonths(1));
                pastPayment.setStatus(Payment.PaymentStatus.PAID);
                pastPayment.setPaidAt(LocalDateTime.now().minusDays(30));
                pastPayment.setPaymentMethod("Credit Card");
                pastPayment.setTransactionId("TXN-" + String.format("%06d", random.nextInt(1000000)));
                payments.add(pastPayment);

                Payment upcomingPayment = new Payment();
                upcomingPayment.setPolicyNumber(policy.getPolicyNumber());
                upcomingPayment.setPolicy(policy);
                upcomingPayment.setAmount(policy.getPremium());
                upcomingPayment.setDueDate(LocalDate.now().plusDays(15 + random.nextInt(15)));
                upcomingPayment.setStatus(Payment.PaymentStatus.UPCOMING);
                payments.add(upcomingPayment);
            }
        }

        paymentRepository.saveAll(payments);
    }
}