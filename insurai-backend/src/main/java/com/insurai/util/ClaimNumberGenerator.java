package com.insurai.util;

import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;

public class ClaimNumberGenerator {

    private static final AtomicInteger counter = new AtomicInteger(1000);

    public static String generate() {
        int year = Year.now().getValue();
        int number = counter.incrementAndGet();
        return String.format("CLM-%d-%04d", year, number);
    }

    public static void reset() {
        counter.set(1000);
    }

    private ClaimNumberGenerator() {
        // Private constructor
    }
}