package nus.iss.tfip.miniProject.repositories.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.Checklist;

@Repository
public interface ChecklistRepository extends JpaRepository<Checklist, Long>{
    List<Checklist> findByAuthorEmail(String email);
    Checklist findByAuthorEmailAndTitle(String email, String title);
    Optional<Checklist> findById(Long id);
}
