package com.gialai.tourism.services.implement;

import com.gialai.tourism.models.dto.request.TourismOverviewRequest;
import com.gialai.tourism.models.dto.response.TourismOverviewResponse;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.TourismOverview;
import com.gialai.tourism.repositories.TourismOverviewRepository;
import com.gialai.tourism.services.AccountService;
import com.gialai.tourism.services.TourismOverviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TourismOverviewServiceImpl implements TourismOverviewService {

    private final TourismOverviewRepository tourismOverviewRepository;
    private final AccountService accountService;

    @Override
    @Transactional(readOnly = true)
    public TourismOverviewResponse get() {
        Optional<TourismOverview> opt = tourismOverviewRepository.findFirstByOrderByUpdatedAtDesc();
        return opt.map(this::toResponse).orElse(null);
    }

    @Override
    @Transactional
    public TourismOverviewResponse update(TourismOverviewRequest request, String username) {
        Account updater = accountService.findByUsername(username);
        TourismOverview overview = tourismOverviewRepository.findFirstByOrderByUpdatedAtDesc()
                .orElse(new TourismOverview());

        overview.setHighlights(request.getHighlights());
        overview.setRevenueLastYear(request.getRevenueLastYear());
        overview.setRevenueNote(request.getRevenueNote());
        overview.setInfrastructureInfo(request.getInfrastructureInfo());
        overview.setUpdatedBy(updater);

        TourismOverview saved = tourismOverviewRepository.save(overview);
        return toResponse(saved);
    }

    private TourismOverviewResponse toResponse(TourismOverview overview) {
        return TourismOverviewResponse.builder()
                .highlights(overview.getHighlights())
                .revenueLastYear(overview.getRevenueLastYear())
                .revenueNote(overview.getRevenueNote())
                .infrastructureInfo(overview.getInfrastructureInfo())
                .updatedAt(overview.getUpdatedAt())
                .updatedByUsername(overview.getUpdatedBy() != null ? overview.getUpdatedBy().getUsername() : null)
                .build();
    }
}