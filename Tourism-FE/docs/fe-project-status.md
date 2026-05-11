# FE Project Status — Gia Lai Tourism & History System

**Date Updated:** May 10, 2026

---

## Overview Progress

| Epic | Module / Feature             | Folder                                                                      | Description                                                                                                                                                | Status  |
|------|------------------------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| 1    | **Authentication**           | `src/modules/auth/pages/`                                                   | Login, Register, Forgot Password (nhập email → OTP → đặt mật khẩu mới)                                                                                    | To Do   |
| 2    | **Post Management (User)**   | `src/modules/post/pages/`                                                   | Danh sách bài viết của tôi, Đăng bài mới (rich text + upload ảnh), Chỉnh sửa bài, Xóa bài, Xem chi tiết bài                                              | To Do   |
| 2    | **Post Approval (Admin)**    | `src/modules/admin/pages/`                                                  | Danh sách bài chờ duyệt, Xem trước bài viết, Phê duyệt, Từ chối kèm lý do                                                                                | To Do   |
| 2    | **Notification**             | `src/modules/notification/`                                                 | Chuông thông báo, Danh sách thông báo, Đánh dấu đã đọc                                                                                                    | To Do   |
| 3    | **User Interaction**         | `src/modules/interaction/`                                                  | Like, Favorite, Bình luận (thêm/sửa/xóa), Đánh giá sao (0–5, bước 0.5)                                                                                  | To Do   |
| 4    | **Homepage**                 | `src/modules/homepage/pages/HomePage`                                       | 4 bài nổi bật (1 tuần), 10 địa điểm hấp dẫn (1 tháng), 6 sự kiện văn hóa/lễ hội (1 tháng)                                                               | To Do   |
| 4    | **History & Culture Page**   | `src/modules/homepage/pages/HistoryPage`                                    | Timeline lịch sử hình thành và phát triển Gia Lai, các sự kiện và địa điểm lịch sử đính kèm                                                               | To Do   |
| 4    | **Tourism Overview Page**    | `src/modules/homepage/pages/TourismOverviewPage`                            | Điểm nổi bật du lịch, doanh thu năm trước, thông tin cơ sở hạ tầng                                                                                        | To Do   |
| 4    | **Events & Festivals Page**  | `src/modules/homepage/pages/EventPage`                                      | Danh sách bài viết theo tag sự kiện/lễ hội, sắp xếp mới nhất, có lọc và tìm kiếm                                                                          | To Do   |
| 4    | **Attractions Page**         | `src/modules/homepage/pages/AttractionPage`                                 | Danh sách điểm tham quan, hiển thị thông tin địa điểm, vị trí, tags liên quan                                                                             | To Do   |
| 5    | **Search & Filter**          | `src/modules/post/pages/PostListPage`                                       | Tìm kiếm theo từ khóa, lọc theo tag, khoảng thời gian; kết quả phân trang                                                                                 | To Do   |
| 5    | **Tourism Map**              | `src/modules/map/pages/MapPage`                                             | Google Maps tích hợp: hiển thị địa điểm gần nhất, zoom out → tất cả địa điểm trong DB                                                                    | To Do   |
| 6    | **Admin – User Management**  | `src/modules/admin/pages/UserManagementPage`                                | Danh sách người dùng, xem chi tiết, khóa/mở tài khoản                                                                                                     | To Do   |
| 6    | **Admin – Tag Management**   | `src/modules/admin/pages/TagManagementPage`                                 | CRUD tag phân loại bài viết                                                                                                                                | To Do   |
| 6    | **Admin – Statistics**       | `src/modules/admin/pages/StatisticsPage`                                    | Biểu đồ bài đăng mới/cập nhật trong tháng; tag nổi bật theo tuần/tháng (like + favorite + avg rating)                                                     | To Do   |
| 7    | **AI – Suggest & Chatbot** *(opt.)* | `src/modules/ai/`                                                   | Gợi ý địa điểm du lịch theo sở thích, Chatbot hỏi đáp thông tin địa điểm                                                                                 | To Do   |

---

## 📋 Notes

| Status          | Ý nghĩa                                              |
|-----------------|------------------------------------------------------|
| **Done**        | Tính năng hoàn thành và đã test                     |
| **In Progress** | Đang phát triển                                     |
| **To Do**       | Đã lên kế hoạch, chưa bắt đầu                      |
| **New**         | Mới thêm vào backlog, chưa khởi động               |

---

## 🗂️ Branch Convention

```
main           ← production
dev            ← tích hợp, base để tạo feature branch
feature/fe-auth
feature/fe-post-create
feature/fe-post-approval
feature/fe-notification
feature/fe-interaction
feature/fe-homepage
feature/fe-history-page
feature/fe-events-page
feature/fe-attractions-page
feature/fe-search
feature/fe-map
feature/fe-admin-dashboard
feature/fe-admin-stats
```

---

## 🔗 Tech Stack

| Thành phần  | Công nghệ                          |
|-------------|------------------------------------|
| Framework   | React (Vite)                       |
| State       | Redux Toolkit                      |
| Styling     | Tailwind CSS                       |
| HTTP Client | Axios                              |
| Rich Text   | React Quill / TipTap               |
| Map         | Google Maps JavaScript API         |
| Deploy      | Vercel                             |
