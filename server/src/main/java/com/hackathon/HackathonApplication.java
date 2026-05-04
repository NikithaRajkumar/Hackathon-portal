package com.hackathon;

import com.hackathon.service.DataSeederService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HackathonApplication {
    public static void main(String[] args) {
        SpringApplication.run(HackathonApplication.class, args);
    }

    @Bean
    CommandLineRunner run(DataSeederService seeder) {
        return args -> seeder.seed();
    }
}
