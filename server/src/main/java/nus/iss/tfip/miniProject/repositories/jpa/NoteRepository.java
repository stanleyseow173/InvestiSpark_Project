package nus.iss.tfip.miniProject.repositories.jpa;

import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.Note;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface NoteRepository extends JpaRepository<Note, String>{
    
}
