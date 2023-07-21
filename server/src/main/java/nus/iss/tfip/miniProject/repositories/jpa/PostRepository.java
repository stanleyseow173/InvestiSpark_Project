package nus.iss.tfip.miniProject.repositories.jpa;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query("SELECT p FROM Post p WHERE p.authorEmail = ?1")
    List<Post> findAllByEmail(String email);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.authorEmail = :email")
    Integer countByUserEmail(@Param("email") String email);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.authorEmail = :email AND p.symbol!=NULL")
    Integer countEstimatesByUserEmail(@Param("email") String email);

    List<Post> findAll(Specification<Post> spec);
}
