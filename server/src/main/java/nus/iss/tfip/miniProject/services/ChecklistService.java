package nus.iss.tfip.miniProject.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.iss.tfip.miniProject.models.Checklist;
import nus.iss.tfip.miniProject.models.ResearchChecklist;
import nus.iss.tfip.miniProject.models.ResearchChecklistItem;
import nus.iss.tfip.miniProject.repositories.jpa.ChecklistRepository;
import nus.iss.tfip.miniProject.repositories.mongo.ResearchChecklistRepository;

@Service
public class ChecklistService {
    
    @Autowired
    private ChecklistRepository checklistRepo;

    @Autowired
    private ResearchChecklistRepository researchChecklistRepo;

    public Checklist saveChecklist(Checklist checklist){
        return checklistRepo.save(checklist);
    }

    public Checklist createNewChecklist(String email){
        Checklist checklist = new Checklist();
        checklist.setAuthorEmail(email);
        checklist.setTitle("Untitled");
        checklist.setItems(new ArrayList<>());
        return saveChecklist(checklist); //save to generate a checklist Id
    }

    public Optional<Checklist> findById(Long id){
        return checklistRepo.findById(id);
    }

    public List<Checklist> getChecklistsByAuthorEmail(String email) {
        //Check if there is a checklist by author email, if there is none - create a new one and send back:
        List<Checklist> existingChecklists = checklistRepo.findByAuthorEmail(email);
        
        if (existingChecklists.size()==0){
            Checklist checklist = new Checklist();
            checklist.setAuthorEmail(email);
            checklist.setTitle("Untitled");
            checklist.setItems(new ArrayList<>());
            saveChecklist(checklist); //save to generate a checklist Id
            return checklistRepo.findByAuthorEmail(email);
        }
        return existingChecklists;
    }

    public void saveResearchChecklist(String nameSymbol, List<Map<String, Object>> itemsList) {
        ResearchChecklist researchChecklist = new ResearchChecklist();
        researchChecklist.setNameSymbol(nameSymbol);
        List<ResearchChecklistItem> items = itemsList.stream().map(item -> {
            ResearchChecklistItem checklistItem = new ResearchChecklistItem();
            checklistItem.setChecked((Boolean) item.get("checked"));
            checklistItem.setItem((String) item.get("item"));
            checklistItem.setRemarks((String) item.get("remarks"));
            return checklistItem;
        }).collect(Collectors.toList());
        researchChecklist.setItems(items);
        researchChecklistRepo.save(researchChecklist);
    }

    public Optional<ResearchChecklist> getResearchChecklistByNameSymbol(String nameSymbol){
        return researchChecklistRepo.findById(nameSymbol);
    }
}
