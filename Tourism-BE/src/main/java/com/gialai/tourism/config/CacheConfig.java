package com.gialai.tourism.config;

import com.gialai.tourism.enums.CacheDuration;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CacheConfig {
    @Bean
    public CacheManager cacheManager(){
        SimpleCacheManager simpleCacheManager = new SimpleCacheManager();
        List<CaffeineCache> caffeineCacheList = Arrays.stream(CacheDuration.values()).
                map(entry -> new CaffeineCache(
                        entry.getCacheName(), cacheBuilder(entry.getDuration())
                )).toList();
        simpleCacheManager.setCaches(caffeineCacheList);
        return simpleCacheManager;
    }

    private Cache<Object, Object> cacheBuilder(Duration duration){
        return Caffeine.newBuilder()
                .initialCapacity(100)
                .maximumSize(500)
                .expireAfterWrite(duration)
                .recordStats()
                .build();
    }
}