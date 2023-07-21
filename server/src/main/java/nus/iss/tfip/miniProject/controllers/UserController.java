package nus.iss.tfip.miniProject.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import nus.iss.tfip.miniProject.payload.response.MessageResponse;
import nus.iss.tfip.miniProject.services.UserFollowerService;
import nus.iss.tfip.miniProject.services.UserStatsService;
import nus.iss.tfip.miniProject.user.User;
import nus.iss.tfip.miniProject.user.UserFollower;
import nus.iss.tfip.miniProject.user.UserStats;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {

    @Autowired
    private UserStatsService userStatsService;

    @Autowired
    private UserFollowerService userFollowerService;

    @GetMapping(path = "/{email}")
    public ResponseEntity<UserStats> getUserStats(@PathVariable String email) {
        UserStats userStats = userStatsService.findByEmail(email);
        if (userStats == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userStats, HttpStatus.OK);
    }

    @GetMapping(path = "/profile/{email}")
    public ResponseEntity<User> getUserProfile(@PathVariable String email) {
        User userProfile = userStatsService.findUserByEmail(email);
        if (userProfile == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }

    @GetMapping(path = "/getAllUsers")
    public List<User> getAllUsers() {
        return (List<User>) userStatsService.findAllUsers();
    }

    @GetMapping(path = "/create/{email}")
    public ResponseEntity<UserStats> createNewUserStats(@PathVariable String email) {
        UserStats userStats = userStatsService.createNewUserStats(email);
        if (userStats == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userStats, HttpStatus.OK);
    }

    @GetMapping(path="/following")
    public List<String> getFollowing(@RequestParam String userEmail){
        return userFollowerService.getFollowing(userEmail);
    }

    @PostMapping("/followUser")
    public ResponseEntity<?> followUser(@RequestBody UserFollower userFollower) {
        userFollowerService.followUser(userFollower);
        return ResponseEntity.ok(new MessageResponse("User followed successfully!"));
    }

    @PostMapping("/unfollowUser")
    public ResponseEntity<?> unFollowUser(@RequestBody UserFollower userFollower) {
        userFollowerService.unFollowUser(userFollower);
        return ResponseEntity.ok(new MessageResponse("User unfollowed successfully!"));
    }

    @GetMapping("/isFollowing")
    public ResponseEntity<?> isFollowing(@RequestParam String userEmail, @RequestParam String followerEmail) {
        boolean isFollowing = userFollowerService.isFollowing(userEmail, followerEmail);
        return new ResponseEntity<>(isFollowing, HttpStatus.OK);
    }
}
