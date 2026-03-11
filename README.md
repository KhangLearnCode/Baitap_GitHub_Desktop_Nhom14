# Hệ thống Xác thực Người dùng (Authentication System)

## 📋 Mô tả dự án

Hệ thống xác thực người dùng đầy đủ với các tính năng:
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập / Đăng xuất
- ✅ Phân quyền cơ bản (User / Admin)
- ✅ Hash mật khẩu với bcrypt
- ✅ JWT (JSON Web Token) để xác thực
- ✅ Dashboard hiển thị thông tin người dùng và quyền

## 🚀 Công nghệ sử dụng

### Backend:
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **bcryptjs** - Hash mật khẩu
- **jsonwebtoken** - JWT authentication
- **dotenv** - Quản lý biến môi trường

### Frontend:
- **HTML5** - Cấu trúc trang
- **CSS3** - Styling
- **JavaScript** - Logic và tương tác với API

## 📁 Cấu trúc thư mục

```
Baitap_GitHub_Desktop_Nhom14/
│
├── config/
│   └── database.js          # Cấu hình kết nối MongoDB
│
├── controllers/
│   └── authController.js    # Controller xử lý đăng ký/đăng nhập
│
├── middleware/
│   └── auth.js              # Middleware xác thực JWT
│
├── models/
│   └── User.js              # Model người dùng
│
├── public/
│   ├── css/
│   │   └── style.css        # Stylesheet
│   ├── js/
│   │   ├── auth.js          # JavaScript cho trang đăng nhập/đăng ký
│   │   └── dashboard.js     # JavaScript cho dashboard
│   ├── index.html           # Trang đăng nhập/đăng ký
│   └── dashboard.html       # Trang dashboard
│
├── routes/
│   └── authRoutes.js        # Routes cho authentication
│
├── .env.example             # Mẫu file biến môi trường
├── .gitignore               # File gitignore
├── package.json             # Dependencies
├── server.js                # Entry point
└── README.md                # File này
```

## ⚙️ Cài đặt và Chạy dự án

### 1. Yêu cầu hệ thống:
- Node.js (v14 trở lên)
- MongoDB (Community hoặc Atlas)
- npm hoặc yarn

### 2. Cài đặt MongoDB:

**Windows:**
- Download MongoDB Community Server từ: https://www.mongodb.com/try/download/community
- Cài đặt và chạy MongoDB service

**Hoặc sử dụng MongoDB Atlas (Cloud):**
- Đăng ký tài khoản tại: https://www.mongodb.com/cloud/atlas
- Tạo cluster miễn phí
- Lấy connection string

### 3. Clone repository:

```bash
git clone https://github.com/yourusername/Baitap_GitHub_Desktop_Nhom14.git
cd Baitap_GitHub_Desktop_Nhom14
```

### 4. Cài đặt dependencies:

```bash
npm install
```

### 5. Cấu hình biến môi trường:

Tạo file `.env` từ file `.env.example`:

```bash
copy .env.example .env
```

Chỉnh sửa file `.env` với thông tin của bạn:

```env
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/auth_db

# Hoặc MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
```

### 6. Chạy ứng dụng:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | Private |
| POST | `/api/auth/logout` | Đăng xuất | Private |

### Request/Response Examples:

**1. Đăng ký (Register):**

```javascript
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "123456",
  "role": "user"  // hoặc "admin"
}

Response:
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**2. Đăng nhập (Login):**

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**3. Lấy thông tin user (Get Me):**

```javascript
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-03-11T00:00:00.000Z"
  }
}
```

## 🔐 Bảo mật

### Password Hashing:
- Mật khẩu được hash bằng **bcryptjs** với salt rounds = 10
- Password không bao giờ được lưu dưới dạng plain text
- Khi query user, password không được trả về (select: false)

### JWT Authentication:
- JWT token được tạo khi đăng ký/đăng nhập thành công
- Token có thời gian hết hạn (mặc định 7 ngày)
- Middleware `protect` kiểm tra token trước khi truy cập các route được bảo vệ
- Token được gửi trong header: `Authorization: Bearer <token>`

### Role-Based Access Control:
- Middleware `authorize` kiểm tra quyền truy cập dựa trên role
- 2 role: `user` và `admin`
- Admin có quyền cao hơn user

## 🎨 Giao diện người dùng

### 1. Trang Đăng nhập/Đăng ký (`index.html`)
- Form đăng nhập
- Form đăng ký với lựa chọn role
- Tab switching giữa login và register
- Hiển thị thông báo lỗi/thành công

### 2. Dashboard (`dashboard.html`)
- Hiển thị thông tin người dùng
- Hiển thị role badge (User/Admin)
- Hiển thị quyền truy cập theo role
- Nút đăng xuất

## 📝 Sử dụng

1. Mở trình duyệt và truy cập: `http://localhost:5000`
2. Đăng ký tài khoản mới:
   - Nhập username, email, password
   - Chọn role (User hoặc Admin)
   - Click "Đăng ký"
3. Hoặc đăng nhập nếu đã có tài khoản
4. Sau khi đăng nhập thành công, bạn sẽ được chuyển đến Dashboard
5. Xem thông tin và quyền của bạn
6. Click "Đăng xuất" để thoát

## 🧪 Testing

Bạn có thể test API bằng:
- **Postman** hoặc **Insomnia**
- Hoặc sử dụng giao diện web đã được tích hợp

## 👥 Phân quyền

### User (Người dùng thường):
- Xem thông tin cá nhân
- Cập nhật hồ sơ
- Thay đổi mật khẩu
- Xem dữ liệu được phép

### Admin (Quản trị viên):
- Tất cả quyền của User
- Quản lý toàn bộ hệ thống
- Thêm, sửa, xóa người dùng
- Xem tất cả dữ liệu
- Thay đổi cấu hình hệ thống
- Quản lý quyền truy cập
- Xem báo cáo và thống kê

## 🐛 Xử lý lỗi phổ biến

**1. MongoDB không kết nối được:**
```
Error: MongoServerError: connect ECONNREFUSED
```
→ Giải pháp: Đảm bảo MongoDB đang chạy. Chạy lệnh `mongod` hoặc start MongoDB service

**2. Port đã được sử dụng:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
→ Giải pháo: Thay đổi PORT trong file `.env` hoặc kill process đang sử dụng port

**3. JWT Secret không được cấu hình:**
```
Error: secretOrPrivateKey must have a value
```
→ Giải pháp: Kiểm tra file `.env` có JWT_SECRET chưa

## 📦 Dependencies chính

```json
{
  "express": "^4.18.2",        // Web framework
  "mongoose": "^8.0.3",        // MongoDB ODM
  "bcryptjs": "^2.4.3",        // Password hashing
  "jsonwebtoken": "^9.0.2",    // JWT authentication
  "dotenv": "^16.3.1",         // Environment variables
  "cors": "^2.8.5",            // CORS middleware
  "express-validator": "^7.0.1" // Validation
}
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License.

## 👨‍💻 Tác giả

**Nhóm 14**

## 📞 Liên hệ

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ qua email hoặc tạo issue trên GitHub.

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star nhé!