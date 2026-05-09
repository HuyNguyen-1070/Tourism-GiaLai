package com.gialai.tourism.services;

public interface CacheService {
    <T> T fetch(String cacheName, Object key, Class<T> type);
    boolean put(String cacheName, Object key, Object value);
    boolean delete(String cacheName, Object key);
}
