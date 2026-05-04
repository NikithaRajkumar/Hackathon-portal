package com.hackathon.repository;
import com.hackathon.model.Hackathon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface HackathonRepository extends JpaRepository<Hackathon, Long> {
    @Query(value = "SELECT * FROM hackathons WHERE rules->'tags' ? :tag", nativeQuery = true)
    List<Hackathon> findByTag(@Param("tag") String tag);
}
