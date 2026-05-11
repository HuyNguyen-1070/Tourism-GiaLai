package com.gialai.tourism.common.constants;

import com.gialai.tourism.models.entities.*;

import java.util.Map;
import static java.util.Map.entry;

public class Constant {
    public static final Map<Class<?>, String> PREFIX_ENTITIES = Map.ofEntries(
            entry(Account.class, "ACC"),
            entry(RefreshToken.class, "RTK"),
            entry(Role.class, "ROL"),
            entry(Post.class, "PST"),
            entry(Notification.class, "NTF"),
            entry(PostLike.class, "LIK"),
            entry(PostFavorite.class, "FAV"),
            entry(Comment.class, "CMT"),
            entry(Rating.class, "RTG"),
            entry(Tag.class, "TAG"),
            entry(Location.class, "LOC")
    );

    public static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    public static final String TIMEZONE_VIETNAM = "Asia/Ho_Chi_Minh";
    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/awake",
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/forgot-password",
            "/api/auth/verify-otp",
            "/api/auth/reset-password",
            "/api/auth/verify-registration",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/api/v3/api-docs/**"
    };
    public static final String REFRESH_TOKEN_ENDPOINT = "/api/auth/refresh-token";
    public static final String REFRESH_TOKEN = "Refresh-Token";
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\\.[a-zA-Z]{2,}$";
    public static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,50}$";
    public static final String PHONE_REGEX = "^\\d{4,20}$";
    public static final long MAX_FILE_SIZE_5MB = 5 * 1024 * 1024;
}