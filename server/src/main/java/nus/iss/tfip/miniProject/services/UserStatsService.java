package nus.iss.tfip.miniProject.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.iss.tfip.miniProject.repositories.jpa.PostRepository;
import nus.iss.tfip.miniProject.repositories.jpa.UserFollowerRepository;
import nus.iss.tfip.miniProject.repositories.jpa.UserRepository;
import nus.iss.tfip.miniProject.repositories.jpa.UserStatsRepository;
import nus.iss.tfip.miniProject.user.User;
import nus.iss.tfip.miniProject.user.UserStats;

@Service
public class UserStatsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserStatsRepository userStatsRepository;

    @Autowired
    private UserFollowerRepository userFollowerRepository;

    public UserStats findByEmail(String email) {
        return userStatsRepository.findByEmail(email);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public UserStats createNewUserStats(String email) {
        UserStats userStats = new UserStats();
        userStats.setEmail(email);
        userStats.setReputation(1);
        userStats.setPosts(0);
        userStats.setFollowers(0);
        userStats.setFollowing(0);
        userStats.setEstimates(0);
        userStats.setLikes(0);
        return userStatsRepository.save(userStats);
    }

    public void updateStats(String email) {
        Integer followersNumber = userFollowerRepository.countByFollowerEmail(email);
        Integer followingNumber = userFollowerRepository.countByUserEmail(email);
        Integer postsNumber = postRepository.countByUserEmail(email);
        Integer estimatesNumber = postRepository.countEstimatesByUserEmail(email);
        // calculate new reputation points
        Integer newReputation = 1 + followersNumber * 3 + postsNumber + estimatesNumber * 2;
        // update user stats
        UserStats userStats = userStatsRepository.findByEmail(email);
        userStats.setFollowers(followersNumber);
        userStats.setFollowing(followingNumber);
        userStats.setPosts(postsNumber);
        userStats.setEstimates(estimatesNumber);
        userStats.setReputation(newReputation);
        userStatsRepository.save(userStats);
    }

}
