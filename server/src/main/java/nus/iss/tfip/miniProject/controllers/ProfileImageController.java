package nus.iss.tfip.miniProject.controllers;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;


import nus.iss.tfip.miniProject.models.Photo;
import nus.iss.tfip.miniProject.repositories.jpa.PhotoRepository;

@Controller
@RequestMapping("/api/photo")
public class ProfileImageController {
    
    @Autowired
    private PhotoRepository photoRepository;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file, @RequestParam("email") String email) {
        Photo img = new Photo();
        img.setEmail(email);
        img.setName(StringUtils.cleanPath(file.getOriginalFilename()));

        try {
            img.setData(file.getBytes());
        } catch (IOException e) {
            // handle exception
        }

        photoRepository.save(img);
        
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{email}")
    public ResponseEntity<byte[]> getImage(@PathVariable String email) {
        Optional<Photo> imageOptional = photoRepository.findById(email);

        if (!imageOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Photo image = imageOptional.get();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + image.getName() + "\"")
                .body(image.getData());
    }
}
