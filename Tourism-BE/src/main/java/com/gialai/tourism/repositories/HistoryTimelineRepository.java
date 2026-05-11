package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.HistoryTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryTimelineRepository extends JpaRepository<HistoryTimeline, String> {
    List<HistoryTimeline> findAllByOrderByYearAscDisplayOrderAsc();
}