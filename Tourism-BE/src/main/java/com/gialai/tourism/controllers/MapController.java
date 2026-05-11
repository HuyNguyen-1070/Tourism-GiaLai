package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.AllLocationResponse;
import com.gialai.tourism.models.dto.response.LocationDetailResponse;
import com.gialai.tourism.models.dto.response.NearbyLocationResponse;
import com.gialai.tourism.services.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class MapController {

    private final MapService mapService;

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") int radius,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) List<String> tags) {

        // Validate coordinates
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Invalid latitude or longitude");
        }

        // Clamp parameters
        if (radius > 200) radius = 200;
        if (limit > 50) limit = 50;

        NearbyLocationResponse response = mapService.getNearbyLocations(lat, lng, radius, limit, tags);

        String message = response.getTotalFound() == 0
                ? "No locations found within " + radius + "km radius"
                : "Nearby locations fetched successfully";

        return ResponseEntity.ok(new ApiResponse(200, "OK", message, response));
    }

    @GetMapping("/all-locations")
    public ResponseEntity<ApiResponse> getAllLocations(
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String keyword) {

        AllLocationResponse response = mapService.getAllLocations(tags, keyword);
        return ResponseEntity.ok(new ApiResponse(200, "OK", "All map locations fetched successfully", response));
    }

    @GetMapping("/locations/{locationId}")
    public ResponseEntity<ApiResponse> getLocationDetail(@PathVariable String locationId) {
        LocationDetailResponse detail = mapService.getLocationDetail(locationId);
        return ResponseEntity.ok(new ApiResponse(200, "OK", "Location detail fetched successfully", detail));
    }
}