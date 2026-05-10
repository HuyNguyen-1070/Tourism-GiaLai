package com.gialai.tourism.services.implement;

import com.gialai.tourism.services.CacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CacheServiceImpl implements CacheService {
    private final CacheManager cacheManager;

    public <T> T fetch(String cacheName, Object key, Class<T> type){
        Cache cache = cacheManager.getCache(cacheName);
        return (cache != null) ? cache.get(key, type) : null;
    }

    public boolean put(String cacheName, Object key, Object value){
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null){
            cache.put(key, value);
            return true;
        }
        return false;
    }

    public boolean delete(String cacheName, Object key){
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null){
            cache.evict(key);
            return true;
        }
        return false;
    }
}