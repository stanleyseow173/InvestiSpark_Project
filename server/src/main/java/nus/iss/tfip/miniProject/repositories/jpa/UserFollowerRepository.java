package nus.iss.tfip.miniProject.repositories.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.user.UserFollower;

@Repository
public interface UserFollowerRepository extends JpaRepository<UserFollower, Long> {

    @Query("SELECT CASE WHEN COUNT(uf) > 0 THEN TRUE ELSE FALSE END FROM UserFollower uf WHERE uf.userEmail = :userEmail AND uf.followerEmail = :followerEmail")
    boolean isFollowing(@Param("userEmail") String userEmail, @Param("followerEmail") String followerEmail);


    @Query("SELECT COUNT(uf) FROM UserFollower uf WHERE uf.userEmail = :email")
    Integer countByUserEmail(@Param("email") String email);

    @Query("SELECT COUNT(uf) FROM UserFollower uf WHERE uf.followerEmail = :email")
    Integer countByFollowerEmail(@Param("email") String email);

    UserFollower findByUserEmailAndFollowerEmail(String userEmail, String followerEmail);

    List<UserFollower> findByUserEmail(String userEmail);
}
