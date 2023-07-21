package nus.iss.tfip.miniProject.rest;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ListController {

    @GetMapping("/list")
    public List<String> getListItems() {
        return List.of("1", "2", "3");
    }
}
