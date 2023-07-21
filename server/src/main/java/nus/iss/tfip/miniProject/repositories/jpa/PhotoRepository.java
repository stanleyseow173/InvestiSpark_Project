package nus.iss.tfip.miniProject.repositories.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, String>{
    
}
