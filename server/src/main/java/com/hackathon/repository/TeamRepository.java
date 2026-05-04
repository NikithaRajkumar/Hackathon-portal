package com.hackathon.repository;
import com.hackathon.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByHackathonId(Long hackathonId);
}
