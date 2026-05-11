package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.CreateLocationRequest;
import com.gialai.tourism.models.dto.request.UpdateLocationRequest;
import com.gialai.tourism.models.dto.response.LocationResponse;
import com.gialai.tourism.services.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/locations")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminLocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody CreateLocationRequest request) {
        LocationResponse response = locationService.createLocation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(201, "CREATED", "Location created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable String id, @Valid @RequestBody UpdateLocationRequest request) {
        LocationResponse response = locationService.updateLocation(id, request);
        return ResponseEntity.ok(new ApiResponse(200, "OK", "Location updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}