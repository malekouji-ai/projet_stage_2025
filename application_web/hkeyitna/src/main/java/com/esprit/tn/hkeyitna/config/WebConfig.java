package com.esprit.tn.hkeyitna.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:3001",
                        "http://192.168.10.126:3000",
                        "http://192.168.100.134:3001",
                        "http://192.168.255.1:3000",
                        "http://localhost:3000/argon-dashboard-react",
                        "http://192.168.10.126:3000/argon-dashboard-react",
                        "http://192.168.255.1:3000/argon-dashboard-react")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
