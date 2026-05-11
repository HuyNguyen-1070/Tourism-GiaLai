# Backend Project Status — Gia Lai Tourism & History System

**Date Updated:** May 10, 2026

---

## 🚀 Overview Progress

| Epic | Module / Feature            | Description                                                                                                                                                                                  | Status      |
|------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 1    | **Authentication**          | Provides APIs for:<br/>- User registration (với validation tên đăng nhập, mật khẩu, email).<br/>- Login bằng username + password.<br/>- Refresh JWT token.<br/>- Forgot password qua OTP email.<br/>- Verify OTP & đặt lại mật khẩu. | To Do       |
| 1    | **Authorization (RBAC)**    | Provides APIs for:<br/>- Phân quyền USER / ADMIN.<br/>- Bảo vệ endpoint theo role.<br/>- Kiểm tra ownership (tác giả chỉ sửa/xóa bài của mình).                                            | To Do       |
| 2    | **Post Management**         | Provides APIs for:<br/>- Đăng bài viết mới (rich text + hình ảnh Cloudinary) → trạng thái PENDING.<br/>- Chỉnh sửa bài (trả về PENDING sau khi sửa).<br/>- Xóa bài (soft delete).<br/>- Xem danh sách bài của tôi.<br/>- Xem chi tiết bài (public với APPROVED). | To Do       |
| 2    | **Post Approval (Admin)**   | Provides APIs for:<br/>- Lấy danh sách bài PENDING.<br/>- Phê duyệt bài (APPROVED).<br/>- Từ chối bài kèm lý do (REJECTED) → gửi notification cho tác giả.<br/>- Admin xóa bài bất kỳ.    | To Do       |
| 2    | **Notification**            | Provides APIs for:<br/>- Lấy danh sách thông báo của người dùng.<br/>- Đánh dấu thông báo đã đọc.<br/>- Gửi thông báo async khi bài được duyệt/từ chối.                                   | To Do       |
| 3    | **User Interaction**        | Provides APIs for:<br/>- Like / Unlike bài viết.<br/>- Favorite / Unfavorite bài viết.<br/>- Bình luận: thêm, sửa, xóa.<br/>- Đánh giá sao (0–5, bước 0.5).                               | To Do       |
| 4    | **Homepage & Content**      | Provides APIs for:<br/>- 4 bài nổi bật trong 1 tuần (theo view + like + favorite).<br/>- 10 địa điểm hấp dẫn trong 1 tháng (tag LOCATION).<br/>- 6 sự kiện văn hóa/lễ hội trong 1 tháng.<br/>- Trang Lịch sử - Văn hóa (timeline).<br/>- Trang Tổng quan du lịch.<br/>- Trang Sự kiện & Lễ hội (có lọc/tìm kiếm).<br/>- Trang Điểm tham quan (thông tin + vị trí + tags). | To Do       |
| 5    | **Search & Map**            | Provides APIs for:<br/>- Tìm kiếm & lọc bài viết (theo từ khóa, tag, khoảng thời gian).<br/>- Lấy danh sách địa điểm du lịch theo tọa độ (gần nhất) và toàn bộ cho Google Maps.          | To Do       |
| 6    | **Admin Dashboard**         | Provides APIs for:<br/>- Quản lý người dùng (xem, khóa tài khoản).<br/>- Quản lý tag (CRUD).<br/>- Thống kê bài đăng mới/cập nhật trong tháng.<br/>- Thống kê tag nổi bật theo tuần/tháng (like + favorite + avg rating). | To Do       |
| 7    | **AI Integration** *(opt.)* | Provides APIs for:<br/>- Gợi ý địa điểm du lịch theo sở thích người dùng.<br/>- Chatbot hỏi đáp thông tin địa điểm.                                                                        | To Do       |

---

## 📋 Legend

| Status        | Ý nghĩa                                              |
|---------------|------------------------------------------------------|
| **Done**      | Đã hoàn thành, merge vào nhánh `dev`                 |
| **Code Review** | Đang được review                                   |
| **In Progress** | Đang phát triển                                    |
| **To Do**     | Đã lên kế hoạch, chưa bắt đầu                       |
| **New**       | Mới thêm vào backlog, chưa khởi động                |

---

## 🗂️ Branch Convention

```
main          ← production
dev           ← tích hợp, base để tạo feature branch
feature/be-auth-login
feature/be-post-create
feature/be-post-approval
feature/be-notification
feature/be-interaction
feature/be-homepage
feature/be-search-map
feature/be-admin-dashboard
```

---

## 🔗 Tech Stack

| Thành phần | Công nghệ                  |
|------------|----------------------------|
| Framework  | Spring Boot 3.x            |
| Auth       | JWT (Access + Refresh Token) |
| Database   | MySQL (Aiven)              |
| ORM        | Hibernate / Spring Data JPA |
| Upload     | Cloudinary                 |
| Cache      | Redis / Spring Cache       |
| Email      | Spring Mail (OTP, thông báo) |
| Deploy     | Render                     |
| Docs       | Swagger / OpenAPI 3        |
