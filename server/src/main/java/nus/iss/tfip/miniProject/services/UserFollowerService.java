package nus.iss.tfip.miniProject.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import nus.iss.tfip.miniProject.repositories.jpa.UserFollowerRepository;
import nus.iss.tfip.miniProject.user.UserFollower;

@Service
public class UserFollowerService {

    @Autowired
    private UserFollowerRepository userFollowerRepository;

    @Autowired
    private UserStatsService userStatsSvc;

    // Recalculate reputation points
    public void updateAndRecalculate(UserFollower userFollower) {
        String userAEmail = userFollower.getUserEmail();
        String userBEmail = userFollower.getFollowerEmail();

        userStatsSvc.updateStats(userAEmail);
        userStatsSvc.updateStats(userBEmail);
    }

    public List<String> getFollowing(String userEmail) {
        return userFollowerRepository.findByUserEmail(userEmail).stream().map(UserFollower::getFollowerEmail)
                .collect(Collectors.toList());
    }

    @Transactional
    public void followUser(UserFollower userFollower) {
        UserFollower existingUserFollower = userFollowerRepository
                .findByUserEmailAndFollowerEmail(userFollower.getUserEmail(), userFollower.getFollowerEmail());
        if (existingUserFollower == null) {
            userFollowerRepository.save(userFollower);
            this.updateAndRecalculate(userFollower);
        }

    }

    @Transactional
    public void unFollowUser(UserFollower userFollower) {
        UserFollower existingUserFollower = userFollowerRepository
                .findByUserEmailAndFollowerEmail(userFollower.getUserEmail(), userFollower.getFollowerEmail());
        if (existingUserFollower != null) {
            userFollowerRepository.delete(existingUserFollower);
            this.updateAndRecalculate(existingUserFollower);
        }
    }

    public boolean isFollowing(String userEmail, String followerEmail) {
        return userFollowerRepository.isFollowing(userEmail, followerEmail);
    }
}
