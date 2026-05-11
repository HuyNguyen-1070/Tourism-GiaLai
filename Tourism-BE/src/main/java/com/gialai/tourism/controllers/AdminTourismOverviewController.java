package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.TourismOverviewRequest;
import com.gialai.tourism.services.TourismOverviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/tourism-overview")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
@Tag(name = "Admin Tourism Overview", description = "Admin update tourism overview")
public class AdminTourismOverviewController {

    private final TourismOverviewService tourismOverviewService;

    @PutMapping
    public ApiResponse updateOverview(@Valid @RequestBody TourismOverviewRequest request,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        return buildResponse(HttpStatus.OK, "Tourism overview updated successfully",
                tourismOverviewService.update(request, userDetails.getUsername()));
    }

    private ApiResponse buildResponse(@NonNull HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}