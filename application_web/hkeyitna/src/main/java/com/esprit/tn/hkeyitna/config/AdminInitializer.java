package com.esprit.tn.hkeyitna.config;

import com.esprit.tn.hkeyitna.domain.UserAccount;
import com.esprit.tn.hkeyitna.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner initializeAdmin(UserAccountRepository userRepository,
            BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                UserAccount admin = new UserAccount();
                admin.setUsername("admin");
                admin.setEmail("admin@hkeyitna.com");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole("admin");
                userRepository.save(admin);
                System.out.println("✅ Admin user created: username=admin, password=admin123");
            } else {
                System.out.println("ℹ️ Admin user already exists");
            }
        };
    }
}
