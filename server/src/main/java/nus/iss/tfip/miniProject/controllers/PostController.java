package nus.iss.tfip.miniProject.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import nus.iss.tfip.miniProject.models.Post;
import nus.iss.tfip.miniProject.payload.request.LinkPreviewRequest;
import nus.iss.tfip.miniProject.payload.response.LinkPreviewData;
import nus.iss.tfip.miniProject.services.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getAllPosts(
        @RequestParam (required = false) String category,
        @RequestParam (required = false) String tag,
        @RequestParam (required = false) List<String> followers,
        @RequestParam (required = false) List<String> symbols
    ) {
        List<Post> posts = postService.getAllPosts(category, tag, followers, symbols);
        Collections.sort(posts, Comparator.comparing(Post::getTimestamp, Comparator.reverseOrder()));
        return posts;
    }

    @PostMapping(path="/getMetaData")
    public ResponseEntity<?> getLinkPreview(@RequestBody LinkPreviewRequest request){
        LinkPreviewData data = postService.getLinkPreview(request.getUrl());
        return ResponseEntity.ok(data);
    }


    @GetMapping("/{email}")
    public List<Post> getAllPostByEmail(@PathVariable String email){
        return postService.getPostsByEmail(email);
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        Post newPost = new Post();
        newPost.setAuthorEmail(post.getAuthorEmail());
        newPost.setContent(post.getContent());
        newPost.setTag(post.getTag());
        newPost.setCategory(post.getCategory());
        if(post.getCategory().equals("Estimation")){
            newPost.setSymbol(post.getSymbol());
            newPost.setTarget(post.getTarget());
            newPost.setTargetDate(post.getTargetDate());
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm'hrs'");
        newPost.setTimestamp(LocalDateTime.now().format(formatter));
        return postService.createPost(newPost);
    }
}
