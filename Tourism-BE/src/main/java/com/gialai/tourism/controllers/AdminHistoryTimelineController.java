package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.HistoryTimelineRequest;
import com.gialai.tourism.services.HistoryTimelineService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/history-timeline")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
@Tag(name = "Admin History Timeline", description = "Admin CRUD for history timeline")
public class AdminHistoryTimelineController {

    private final HistoryTimelineService historyTimelineService;

    @PostMapping
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody HistoryTimelineRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(buildResponse(HttpStatus.CREATED, "History timeline entry created successfully",
                        historyTimelineService.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse update(@PathVariable String id, @Valid @RequestBody HistoryTimelineRequest request) {
        return buildResponse(HttpStatus.OK, "History timeline updated successfully",
                historyTimelineService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable String id) {
        historyTimelineService.delete(id);
        return buildResponse(HttpStatus.NO_CONTENT, "History timeline deleted successfully", null);
    }

    private ApiResponse buildResponse(HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}