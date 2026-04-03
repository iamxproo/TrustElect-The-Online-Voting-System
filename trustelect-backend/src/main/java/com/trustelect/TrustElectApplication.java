package com.trustelect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TrustElectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrustElectApplication.class, args);
    }
}
