package nus.iss.tfip.miniProject.repositories.mongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.ResearchChecklist;

@Repository
public interface ResearchChecklistRepository extends MongoRepository<ResearchChecklist, String>{
}
