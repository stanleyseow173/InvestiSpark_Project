package nus.iss.tfip.miniProject.repositories.mongo;

import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.StockOverview;

import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface StockOverviewRepository extends MongoRepository<StockOverview, String>{
    StockOverview findBySymbol(String symbol);
}
