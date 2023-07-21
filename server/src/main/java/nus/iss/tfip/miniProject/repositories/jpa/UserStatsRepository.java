package nus.iss.tfip.miniProject.repositories.jpa;

import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.user.UserStats;

import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, String>{
    UserStats findByEmail(String email);
}
