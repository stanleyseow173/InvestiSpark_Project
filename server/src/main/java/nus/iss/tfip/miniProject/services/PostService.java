package nus.iss.tfip.miniProject.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nus.iss.tfip.miniProject.models.Post;
import nus.iss.tfip.miniProject.payload.response.LinkPreviewData;
import nus.iss.tfip.miniProject.repositories.jpa.PostRepository;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserStatsService userStatsService;

    public List<Post> getAllPosts(String category, String tag, List<String> followers, List<String> symbols) {
        List<Post> posts = postRepository.findAll();

        // Filter by category, if specified
        if (category != null && !category.isEmpty()) {
            posts = posts.stream()
                .filter(post -> post.getCategory().equals(category))
                .collect(Collectors.toList());
        }

        // Filter by tag, if specified
        if (tag != null && !tag.isEmpty()) {
            posts = posts.stream()
                .filter(post -> post.getTag().contains(tag))
                .collect(Collectors.toList());
        }

        // Filter by followers, if specified
        if (followers != null && !followers.isEmpty()) {
            posts = posts.stream()
                .filter(post -> followers.contains(post.getAuthorEmail()))
                .collect(Collectors.toList());
        }   
        
        // Filter by symbols, if specified
        if (symbols != null && !symbols.isEmpty()) {
            posts = posts.stream()
                .filter(post -> post.convertTags().stream().anyMatch(t -> symbols.contains(t)))
                .collect(Collectors.toList());
        }  

        return posts;
    }

    public LinkPreviewData getLinkPreview(String url){
        Document document;
        try{
            document = Jsoup.connect(url).get();
            String title = document.select("meta[property=og:title]").get(0).attr("content");
            String description = document.select("meta[property=og:description]").get(0).attr("content");
            String imageURL = document.select("meta[property=og:image]").get(0).attr("content");
            return new LinkPreviewData(url, title, description, imageURL);
        } catch (IOException e){
            e.printStackTrace();
            return new LinkPreviewData();
        }
        
    }

    @Transactional
    public Post createPost(Post post) {
        Post newPost = postRepository.save(post);
        userStatsService.updateStats(post.getAuthorEmail());
        return newPost;
    }

    public List<Post> getPostsByEmail(String email){
        return postRepository.findAllByEmail(email);
    }
}
