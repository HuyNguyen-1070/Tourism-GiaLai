package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.repositories.*;
import com.gialai.tourism.services.AdminStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

    private final PostRepository postRepository;
    private final AccountRepository accountRepository;
    private final TagRepository tagRepository;
    private final LocationRepository locationRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;

    @Override
    @Cacheable(value = "adminOverview", key = "'overview'")
    public OverviewStatsResponse getOverview() {
        long totalPosts = postRepository.countByStatusNot(PostStatus.DELETED);
        long pendingPosts = postRepository.countByStatus(PostStatus.PENDING);
        long approvedPosts = postRepository.countByStatus(PostStatus.APPROVED);
        long rejectedPosts = postRepository.countByStatus(PostStatus.REJECTED);
        long totalUsers = accountRepository.count();
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long newUsersLast30Days = accountRepository.countByCreatedAtAfter(thirtyDaysAgo);
        long totalTags = tagRepository.count();
        long totalLocations = locationRepository.count();
        long totalComments = commentRepository.countByIsDeletedFalse();
        long totalLikes = postLikeRepository.count();

        return OverviewStatsResponse.builder()
                .totalPosts(totalPosts)
                .pendingPosts(pendingPosts)
                .approvedPosts(approvedPosts)
                .rejectedPosts(rejectedPosts)
                .totalUsers(totalUsers)
                .newUsersLast30Days(newUsersLast30Days)
                .totalTags(totalTags)
                .totalLocations(totalLocations)
                .totalComments(totalComments)
                .totalLikes(totalLikes)
                .build();
    }

    @Override
    public PostActivityResponse getPostActivity(int month, int year) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<PostActivityResponse.DailyActivity> daily = IntStream.rangeClosed(1, yearMonth.lengthOfMonth())
                .mapToObj(day -> {
                    LocalDate date = yearMonth.atDay(day);
                    LocalDateTime dayStart = date.atStartOfDay();
                    LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
                    long newPosts = postRepository.countByCreatedAtBetween(dayStart, dayEnd);
                    long updatedPosts = postRepository.countByUpdatedAtBetweenAndCreatedAtBefore(dayStart, dayEnd, dayStart);
                    return PostActivityResponse.DailyActivity.builder()
                            .date(date.toString())
                            .newPosts(newPosts)
                            .updatedPosts(updatedPosts)
                            .build();
                }).collect(Collectors.toList());

        long totalNew = daily.stream().mapToLong(PostActivityResponse.DailyActivity::getNewPosts).sum();
        long totalUpdated = daily.stream().mapToLong(PostActivityResponse.DailyActivity::getUpdatedPosts).sum();

        return PostActivityResponse.builder()
                .month(month)
                .year(year)
                .totalNew(totalNew)
                .totalUpdated(totalUpdated)
                .daily(daily)
                .build();
    }

    @Override
    @Cacheable(value = "trendingTagsAdmin", key = "{#period, #limit}")
    public TrendingTagsWrapper getTrendingTags(String period, int limit) {
        LocalDateTime start = "WEEK".equalsIgnoreCase(period) ?
                LocalDateTime.now().minusWeeks(1) : LocalDateTime.now().minusMonths(1);
        LocalDateTime end = LocalDateTime.now();
        List<Object[]> results = postRepository.trendingTags(start, PostStatus.APPROVED.name(), limit);
        List<TrendingTagResponse> tags = IntStream.range(0, results.size())
                .mapToObj(i -> {
                    Object[] row = results.get(i);
                    return TrendingTagResponse.builder()
                            .rank(i + 1)
                            .tagId((String) row[0])
                            .tagName((String) row[1])
                            .postCount(((Number) row[2]).longValue())
                            .totalLikes(((Number) row[3]).longValue())
                            .totalFavorites(((Number) row[4]).longValue())
                            .avgRating(((Number) row[5]).doubleValue())
                            .tagScore(((Number) row[6]).doubleValue())
                            .build();
                }).collect(Collectors.toList());
        return TrendingTagsWrapper.builder()
                .period(period)
                .from(start)
                .to(end)
                .tags(tags)
                .build();
    }

    @Override
    public PostEngagementWrapper getPostEngagement(String period, List<String> tags, int limit) {
        LocalDateTime start = "WEEK".equalsIgnoreCase(period) ?
                LocalDateTime.now().minusWeeks(1) : LocalDateTime.now().minusMonths(1);
        LocalDateTime end = LocalDateTime.now();

        List<Object[]> results;
        if (tags == null || tags.isEmpty()) {
            results = postRepository.topEngagedPostsWithoutTags(start, PostStatus.APPROVED.name(), limit);
        } else {
            results = postRepository.topEngagedPostsWithTags(start, PostStatus.APPROVED.name(), tags, limit);
        }

        List<PostEngagementResponse> posts = IntStream.range(0, results.size())
                .mapToObj(i -> {
                    Object[] row = results.get(i);
                    String postId = (String) row[0];
                    List<String> tagNames = postRepository.findTagNamesByPostId(postId);
                    return PostEngagementResponse.builder()
                            .rank(i + 1)
                            .postId(postId)
                            .title((String) row[1])
                            .tags(tagNames)
                            .authorUsername((String) row[2])
                            .viewCount(((Number) row[3]).longValue())
                            .likeCount(((Number) row[4]).longValue())
                            .favoriteCount(((Number) row[5]).longValue())
                            .averageRating(((Number) row[6]).doubleValue())
                            .engagementScore(((Number) row[7]).longValue())
                            .build();
                }).collect(Collectors.toList());

        return PostEngagementWrapper.builder()
                .period(period)
                .from(start)
                .to(end)
                .posts(posts)
                .build();
    }
}