package com.hackathon.repository;
import com.hackathon.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByHackathonId(Long hackathonId);
}
