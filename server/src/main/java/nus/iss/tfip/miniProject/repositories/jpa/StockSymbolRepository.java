package nus.iss.tfip.miniProject.repositories.jpa;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.Stock;

@Repository
public interface StockSymbolRepository extends JpaRepository<Stock, Long> {

    @Query("SELECT s FROM Stock s WHERE s.name LIKE %:filter% OR s.symbol LIKE %:filter%")
    List<Stock> getStocks(String filter, Pageable pageable);

    @Query("SELECT s FROM Stock s WHERE s.symbol LIKE %:filter%")
    List<Stock> getSymbols(String filter, Pageable pageable);

}
