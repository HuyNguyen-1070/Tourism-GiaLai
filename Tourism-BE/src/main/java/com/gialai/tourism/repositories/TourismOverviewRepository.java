package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.TourismOverview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TourismOverviewRepository extends JpaRepository<TourismOverview, String> {
    Optional<TourismOverview> findFirstByOrderByUpdatedAtDesc();
}