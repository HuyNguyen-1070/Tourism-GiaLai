# Back-end Guidelines — Gia Lai Tourism & History System

---

## 1. Naming Convention

### 1.1. General Rules

* Class → noun: `PostService`
* Method → verb: `createPost`
* Boolean → is/has/can: `isApproved`, `isActive`
* Do not abbreviate: không dùng `postSvc`, `usrRepo`

### 1.2. Class Naming

|   | Type         | Naming                        | Example                    |
|---|--------------|-------------------------------|----------------------------|
| 1 | Controller   | `[Entity]Controller`          | `PostController`           |
| 2 | Service      | `[Entity]Service`             | `PostService`              |
| 3 | Repository   | `[Entity]Repository`          | `PostRepository`           |
| 4 | Entity       | Singular                      | `Post`, `User`, `Tag`      |
| 5 | Request DTO  | `Action + Entity + Request`   | `CreatePostRequest`        |
| 6 | Response DTO | `Entity + Response`           | `PostResponse`, `UserResponse` |
| 7 | Mapper       | `[Entity]Mapper`              | `PostMapper`               |
| 8 | Exception    | `SomethingException`          | `PostNotFoundException`    |

### 1.3. Method Naming

```java
createPost()
getPostById()
getAllPosts()
updatePost()
deletePost()
approvePost()
rejectPost()
```

### 1.4. Repository Naming

```java
findByStatus()
findByAuthorId()
findByTagsContaining()
findTopByOrderByViewCountDesc()
deleteById()
```

### 1.5. Variable Naming

```java
post
postList
totalLikes
isApproved
averageRating
viewCount
```

### 1.6. Database Naming

```
users
posts
tags
post_tags
comments
notifications
ratings
post_images
```

---

## 2. API Design (RESTful)

### 2.1. Standard Endpoints

|   | Action  | Method | Endpoint                |
|---|---------|--------|-------------------------|
| 1 | Get all | GET    | `/api/v1/posts`         |
| 2 | Get one | GET    | `/api/v1/posts/{id}`    |
| 3 | Create  | POST   | `/api/v1/posts`         |
| 4 | Update  | PUT    | `/api/v1/posts/{id}`    |
| 5 | Delete  | DELETE | `/api/v1/posts/{id}`    |

### 2.2. Query & Nested Params

```
GET /api/v1/posts?status=APPROVED
GET /api/v1/posts?tags=LOCATION,CULTURE
GET /api/v1/posts?keyword=thác+Phú+Cường
GET /api/v1/posts?page=0&size=10&sort=createdAt,desc
GET /api/v1/posts/{postId}/comments
GET /api/v1/admin/posts?status=PENDING
```

### 2.3. Special Actions

```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh-token
POST /api/v1/auth/forgot-password
POST /api/v1/auth/verify-otp
PATCH /api/v1/admin/posts/{id}/approve
PATCH /api/v1/admin/posts/{id}/reject
POST  /api/v1/posts/{id}/like
POST  /api/v1/posts/{id}/favorite
PATCH /api/v1/notifications/{id}/read
```

### 2.4. Response Format

```json
{
  "code": 200,
  "status": "OK",
  "message": "Post list fetched successfully.",
  "data": { }
}
```

---

## 3. DTO & Data Flow

### 3.1. Controller

```java
@PostMapping
public ResponseEntity<ApiResponse> create(@Valid @RequestBody CreatePostRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(postService.createPost(request));
}
```

### 3.2. Request DTO

```java
public class CreatePostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 255)
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotEmpty(message = "At least one tag is required")
    private List<String> tags;

    @NotNull
    private SourceType sourceType;

    private String sourceName; // required if sourceType = EXTERNAL
}
```

### 3.3. Response DTO

```java
public class PostResponse {
    private String id;
    private String title;
    private String summary;
    private List<String> tags;
    private List<String> images;
    private String authorUsername;
    private SourceType sourceType;
    private String sourceName;
    private PostStatus status;
    private long viewCount;
    private long likeCount;
    private double averageRating;
    private LocalDateTime createdAt;
}
```

### 3.4. Notes

* Không dùng Entity làm response.
* Không lộ các trường nhạy cảm (`password`, `refreshToken`).
* Không dùng `Map<String, Object>` — phải dùng DTO cụ thể.

---

## 4. Layered Architecture

Flow: **Controller → Service → Repository → Database**

| Layer      | Trách nhiệm                                      |
|------------|--------------------------------------------------|
| Controller | Nhận request, validate input, trả response       |
| Service    | Business logic: duyệt bài, tính điểm nổi bật, gửi thông báo |
| Repository | Chỉ truy vấn DB, không chứa logic               |

---

## 5. Mapper

```java
@Component
public class PostMapper {
    public PostResponse toResponse(Post post) {
        return PostResponse.builder()
            .id(post.getId())
            .title(post.getTitle())
            .status(post.getStatus())
            .authorUsername(post.getAuthor().getUsername())
            .averageRating(post.getAverageRating())
            .build();
    }
}
```

---

## 6. Error Handling

### Global Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<?> handleNotFound(PostNotFoundException ex, HttpServletRequest req) {
        return ResponseEntity.status(404).body(ErrorResponse.of(404, "NOT_FOUND", ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleForbidden(AccessDeniedException ex, HttpServletRequest req) {
        return ResponseEntity.status(403).body(ErrorResponse.of(403, "FORBIDDEN", ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex, HttpServletRequest req) {
        return ResponseEntity.status(500).body(ErrorResponse.of(500, "INTERNAL_ERROR", "Something went wrong", req.getRequestURI()));
    }
}
```

### Error Response Format

```json
{
  "timestamp": "2026-05-09 10:00:00",
  "path": "/api/v1/posts/post_abc123",
  "code": 404,
  "status": "NOT_FOUND",
  "message": "Post 'post_abc123' not found"
}
```

---

## 7. Database

### Query

```java
// Tránh N+1 — load post kèm tags và images trong 1 query
@Query("SELECT p FROM Post p JOIN FETCH p.tags JOIN FETCH p.images WHERE p.status = :status")
List<Post> findAllApprovedWithDetails(@Param("status") PostStatus status);

// Lấy top bài nổi bật trong 1 tuần
@Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND p.createdAt >= :since ORDER BY (p.viewCount + p.likeCount + p.favoriteCount) DESC")
List<Post> findFeaturedPosts(@Param("since") LocalDateTime since, Pageable pageable);
```

### Transaction

```java
@Transactional
public void approvePost(String postId, String adminId) {
    Post post = postRepository.findById(postId).orElseThrow(...);
    post.setStatus(PostStatus.APPROVED);
    postRepository.save(post);
    notificationService.notifyUser(post.getAuthor(), "POST_APPROVED", postId);
}
```

### Rules

* Bắt buộc phòng tránh N+1 query với `JOIN FETCH`.
* Dùng `@Transactional` khi thao tác nhiều bảng cùng lúc (approve/reject + notification).
* Đặt index trên các cột thường xuyên query: `status`, `created_at`, `author_id`.

---

## 8. Security

```java
// Encode password
String hash = passwordEncoder.encode(rawPassword);

// Kiểm tra quyền trong service
if (!post.getAuthor().getId().equals(currentUserId)) {
    throw new AccessDeniedException("You do not have permission to edit this post");
}
```

**Rules:**
* Không lưu mật khẩu dạng plain text.
* Access token: thời hạn ngắn (15–30 phút).
* Refresh token: thời hạn dài (7–30 ngày), lưu DB.
* OTP: hết hạn sau 5 phút, giới hạn 5 lần gửi/ngày.

---

## 9. Performance

### Pagination

```java
Page<Post> page = postRepository.findAll(PageRequest.of(0, 10, Sort.by("createdAt").descending()));
```

### Caching (tag nổi bật, trang chủ)

```java
@Cacheable("featuredPosts")
public List<PostResponse> getFeaturedPosts() { ... }

@CacheEvict(value = "featuredPosts", allEntries = true)
public void approvePost(...) { ... }
```

### Async (gửi thông báo, email OTP)

```java
@Async
public void sendOtpEmail(String email, String otp) { ... }

@Async
public void sendRejectionNotification(String userId, String reason) { ... }
```

---

## 10. Project Structure

```
src/main/java/com/gialai/tourism/
├── common/
│   ├── base/            # BaseEntity (id, createdAt, updatedAt), ApiResponse, ErrorResponse
│   ├── constants/       # AppConstants (OTP_EXPIRE_MINUTES, MAX_IMAGES_PER_POST, ...)
│   └── utils/           # SlugUtils, DateUtils, HtmlSanitizer
├── config/              # SecurityConfig, CloudinaryConfig, CacheConfig, SwaggerConfig
├── controllers/         # PostController, AuthController, AdminController, NotificationController
├── enums/               # PostStatus, SourceType, TagType, Role, NotificationType
├── exceptions/          # PostNotFoundException, UnauthorizedException, GlobalExceptionHandler
├── models/
│   ├── dto/
│   │   ├── request/     # CreatePostRequest, UpdatePostRequest, RejectPostRequest, LoginRequest, ...
│   │   └── response/    # PostResponse, UserResponse, NotificationResponse, PageResponse<T>
│   ├── entities/        # Post, User, Tag, Comment, Rating, Notification, PostImage
│   └── mappers/         # PostMapper, UserMapper, CommentMapper, NotificationMapper
├── repositories/        # PostRepository, UserRepository, TagRepository, NotificationRepository
├── services/            # PostService, AuthService, NotificationService, RatingService, TagService
├── specifications/      # PostSpecification (filter by tag, keyword, status, date range)
├── validators/
│   ├── annotations/     # @ValidPostContent, @ValidOtp
│   └── constraint/      # PostContentValidator, OtpValidator
└── GialaITourismApplication.java
```

---

## 11. Core Rules

|   | Rule                                       | Giải thích                                         |
|---|--------------------------------------------|----------------------------------------------------|
| 1 | Controller không chứa business logic       | Chỉ nhận request, gọi service, trả response        |
| 2 | Service là tầng cốt lõi                    | Toàn bộ logic: duyệt bài, tính điểm, phân quyền   |
| 3 | Repository chỉ xử lý DB                   | Không chứa logic nghiệp vụ                         |
| 4 | DTO tách biệt với Entity                   | Tránh lộ dữ liệu nội bộ                            |
| 5 | Mapper xử lý chuyển đổi                    | Không mapping thủ công lặp lại trong service       |
| 6 | Không expose Entity trong response         | Luôn dùng ResponseDTO                              |
| 7 | Kiểm tra ownership trước mọi thao tác sửa/xóa | Tác giả chỉ được sửa/xóa bài của mình         |
| 8 | Admin action phải log lại                  | Ghi lại ai duyệt/từ chối bài nào, lúc nào         |
