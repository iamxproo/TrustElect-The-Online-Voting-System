package com.trustelect.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.trustelect.model.Admin;
import com.trustelect.repository.AdminRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            Admin admin = Admin.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .name("System Administrator")
                    .email("admin@trustelect.com")
                    .build();
            adminRepository.save(admin);
            log.info("Default admin created: username=admin, password=admin123");
        }
    }
}
