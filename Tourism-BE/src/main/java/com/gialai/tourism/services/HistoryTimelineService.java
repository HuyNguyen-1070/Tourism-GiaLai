package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.request.HistoryTimelineRequest;
import com.gialai.tourism.models.dto.response.HistoryTimelineResponse;

import java.util.List;

public interface HistoryTimelineService {
    List<HistoryTimelineResponse> getAll();
    HistoryTimelineResponse create(HistoryTimelineRequest request);
    HistoryTimelineResponse update(String id, HistoryTimelineRequest request);
    void delete(String id);
}