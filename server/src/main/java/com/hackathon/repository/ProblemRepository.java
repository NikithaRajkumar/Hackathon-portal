package com.hackathon.repository;
import com.hackathon.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByHackathonId(Long hackathonId);
}
