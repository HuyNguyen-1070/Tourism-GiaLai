# Front-end Guideline — Gia Lai Tourism & History System

---

## Objectives

- Code dễ đọc, dễ maintain, dễ mở rộng theo từng epic
- Giảm bug (hạn chế side effect, tách biệt rõ logic và UI)
- Tối ưu performance & UX cho cả người dùng và Admin

---

## 1. Tech Stack

| Thành phần  | Công nghệ                  |
| ----------- | -------------------------- |
| Framework   | React (Vite)               |
| State       | Redux Toolkit              |
| Styling     | Tailwind CSS               |
| HTTP Client | Axios                      |
| Rich Text   | React Quill / TipTap       |
| Map         | Google Maps JavaScript API |
| Deploy      | Vercel                     |

---

## 2. Clean Code Rules

### 2.1. Naming Convention

- Variable: danh từ, có ý nghĩa → `postList`, `isLoading`, `currentUser`
- Function: động từ + danh từ → `fetchPosts`, `handleApprove`, `handleSubmitComment`
- Boolean: is/has/can → `isApproved`, `hasError`, `canEdit`
- Constant: UPPER_CASE → `API_BASE_URL`, `MAX_IMAGES`, `OTP_EXPIRE_SECONDS`

```js
const postList = [];
const isLoading = false;
const MAX_IMAGES = 10;
```

### 2.2. Function Rules

- 1 function = 1 nhiệm vụ
- Tối đa ~20–30 dòng
- Không lồng if quá 3 cấp

```js
const handleSubmitPost = async () => {
  if (!isValidForm()) return;
  await createPost();
};

const isValidForm = () => form.title && form.content && form.tags.length > 0;

const createPost = async () => {
  const res = await postService.create(form);
  handleSuccess(res);
};
```

---

## 3. Component Architecture

Tách biệt rõ 3 tầng: **service (API) → hook (logic) → component (UI)**

### 3.1. Service

```ts
// src/modules/post/services/postService.ts
export const postService = {
  getPosts: (params) => api.get('/posts', { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getMyPosts: (params) => api.get('/posts/me', { params }),
};

// src/modules/admin/services/adminPostService.ts
export const adminPostService = {
  getPendingPosts: (params) => api.get('/admin/posts', { params }),
  approvePost: (id) => api.patch(`/admin/posts/${id}/approve`),
  rejectPost: (id, data) => api.patch(`/admin/posts/${id}/reject`, data),
};
```

### 3.2. Hook

```ts
// src/modules/post/hooks/usePostList.ts
export const usePostList = (params) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await postService.getPosts(params);
      setPosts(res.data.data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return { posts, loading, error, fetchPosts };
};
```

### 3.3. UI Component

```jsx
// src/modules/post/components/PostList.jsx
const PostList = ({ posts }) => {
  if (!posts.length) return <EmptyState message="Chưa có bài viết nào." />;
  return posts.map((post) => <PostCard key={post.id} post={post} />);
};
```

---

## 4. API Handling

### 4.1. Axios Instance

```ts
// src/shared/api/axiosInstance.ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});
```

### 4.2. Interceptor (JWT + Refresh Token)

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // gọi refresh token, nếu thất bại → logout
      await authService.refreshToken();
    }
    return Promise.reject(err);
  }
);
```

### 4.3. Xử lý tất cả trạng thái

```jsx
const PostPage = () => {
  const { posts, loading, error, fetchPosts } = usePostList();
  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!posts.length) return <EmptyState />;
  return <PostList posts={posts} />;
};
```

**Rules:**

- Không gọi API trực tiếp trong component
- Luôn xử lý đủ 4 trạng thái: loading / success / error / empty
- Không để lộ logic API call trong JSX

---

## 5. Rich Text Editor (Bài viết)

```jsx
// src/modules/post/components/PostEditor.jsx
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostEditor = ({ value, onChange }) => (
  <ReactQuill
    theme="snow"
    value={value}
    onChange={onChange}
    modules={{
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ heading: [1, 2, 3] }],
        ['image', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
    }}
  />
);
```

**Rule:** Sanitize HTML trước khi gửi lên BE để tránh XSS.

---

## 6. State Management (Redux Toolkit)

```ts
// src/modules/auth/store/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});
```

**Rules:**

- Không lưu state có thể tính toán được (computed state)
- Redux chỉ lưu global state: `auth`, `notifications`
- State cục bộ của form/modal dùng `useState` trong component

---

## 7. Performance

### Re-render

```js
// Tránh tạo hàm mới mỗi lần render
const handleLike = useCallback(() => {
  likePost(post.id);
}, [post.id]);
```

### Memoization

```js
// Tránh tính toán lại không cần thiết
const featuredPosts = useMemo(() => posts.filter((p) => p.isFeatured), [posts]);
```

### Code Splitting

```js
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
```

### Checklist

- [ ] Re-render không cần thiết?
- [ ] Dùng đúng `key` trong list?
- [ ] Lazy load cho trang nặng (Map, Admin)?
- [ ] Debounce ô tìm kiếm?
- [ ] Ảnh được tối ưu (lazy load, đúng kích thước)?

---

## Folder Structure

### Bad

```
src/
  components/
  utils/
  pages/
```

### Best (feature-based)

```
src/modules/user/{components,hooks,services,types,pages}
```

### Shared

```
src/shared/{components,hooks,utils,constants}
```

### Why

- Scalable
- Maintainable
- Reusable
