package com.hackathon.service;

import com.hackathon.model.*;
import com.hackathon.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class DataSeederService {
    @Autowired private UserRepository userRepo;
    @Autowired private HackathonRepository hackRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    public void seed() {
        if (!userRepo.existsByEmail("admin@hack.com")) {
            userRepo.save(User.builder()
                .name("Admin").email("admin@hack.com")
                .password(passwordEncoder.encode("admin"))
                .role("admin")
                .preferences(Map.of("theme", "light", "notifications", true))
                .build());

            hackRepo.save(Hackathon.builder()
                .title("AI Innovation Challenge 2024")
                .description("Build innovative AI solutions")
                .status("Active")
                .rules(Map.of("prize", "$5000", "eligibility", "Open to all", "tags", List.of("AI", "ML", "NLP")))
                .build());

            hackRepo.save(Hackathon.builder()
                .title("Web3 Hackathon")
                .description("Explore decentralized technologies")
                .status("Active")
                .rules(Map.of("prize", "$3000", "eligibility", "Open to all", "tags", List.of("Blockchain", "DeFi", "NFT")))
                .build());
        }
    }
}
