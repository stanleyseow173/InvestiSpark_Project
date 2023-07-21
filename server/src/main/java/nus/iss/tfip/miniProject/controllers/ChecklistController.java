package nus.iss.tfip.miniProject.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

import nus.iss.tfip.miniProject.models.Checklist;
import nus.iss.tfip.miniProject.models.ResearchChecklist;
import nus.iss.tfip.miniProject.payload.response.MessageResponse;
import nus.iss.tfip.miniProject.services.ChecklistService;

@RestController
@RequestMapping("/api/checklist")
public class ChecklistController {

    @Autowired
    private ChecklistService checklistService;

    @PostMapping("/create")
    public Checklist createNewChecklist(@RequestParam String authorEmail) {
        return checklistService.createNewChecklist(authorEmail);
    }

    @GetMapping
    public ResponseEntity<Checklist> getChecklistById(@RequestParam String id) {
        Optional<Checklist> checklistOpt = checklistService.findById(Long.parseLong(id));
        if (checklistOpt.isPresent()) {
            return new ResponseEntity<>(checklistOpt.get(), HttpStatus.OK);
        } else {
            System.out.println("Checklist cannot be found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public Checklist saveChecklist(@RequestBody Checklist checklist) {
        return checklistService.saveChecklist(checklist);
    }

    @GetMapping("/{email}")
    public List<Checklist> getChecklistsByAuthorEmail(@PathVariable String email) {
        return checklistService.getChecklistsByAuthorEmail(email);
    }

    @PostMapping("/researchChecklist")
    public ResponseEntity<?> saveResearchChecklist(@RequestBody Map<String, Object> payload) {
        String nameSymbol = (String) payload.get("nameSymbol");
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        checklistService.saveResearchChecklist(nameSymbol, items);
        return ResponseEntity.ok(new MessageResponse("Research checklist saved successfully"));
    }

    @GetMapping("/researchChecklist/{nameSymbol}")
    public ResponseEntity<ResearchChecklist> getResearchChecklist(@PathVariable String nameSymbol) {
        Optional<ResearchChecklist> researchChecklistOpt = checklistService
                .getResearchChecklistByNameSymbol(nameSymbol);
        if (researchChecklistOpt.isPresent()) {
            return new ResponseEntity<>(researchChecklistOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
