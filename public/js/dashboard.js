const API_URL = 'http://localhost:5000/api';

// Kiểm tra đăng nhập
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return false;
  }
  return token;
}

// Lấy thông tin user
async function loadUserInfo() {
  const token = checkAuth();
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      const user = data.user;
      
      // Hiển thị thông tin user
      document.getElementById('userId').textContent = user.id;
      document.getElementById('username').textContent = user.username;
      document.getElementById('email').textContent = user.email;
      
      const roleBadge = document.getElementById('role');
      roleBadge.textContent = user.role.toUpperCase();
      roleBadge.classList.add(user.role);

      const createdDate = new Date(user.createdAt);
      document.getElementById('createdAt').textContent = createdDate.toLocaleDateString('vi-VN');

      // Hiển thị quyền dựa trên role
      displayPermissions(user.role);
    } else {
      // Token không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Load user info error:', error);
    const messageDiv = document.getElementById('dashboardMessage');
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Không thể tải thông tin người dùng';
  }
}

// Hiển thị quyền theo role
function displayPermissions(role) {
  const permissionsContent = document.getElementById('permissionsContent');
  
  let permissions = [];
  
  if (role === 'admin') {
    permissions = [
      'Quản lý toàn bộ hệ thống',
      'Thêm, sửa, xóa người dùng',
      'Xem tất cả dữ liệu',
      'Thay đổi cấu hình hệ thống',
      'Quản lý quyền truy cập',
      'Xem báo cáo và thống kê'
    ];
  } else {
    permissions = [
      'Xem thông tin cá nhân',
      'Cập nhật hồ sơ',
      'Thay đổi mật khẩu',
      'Xem dữ liệu được phép'
    ];
  }

  const permissionsList = document.createElement('ul');
  permissionsList.className = 'permissions-list';

  permissions.forEach(permission => {
    const li = document.createElement('li');
    li.textContent = permission;
    permissionsList.appendChild(li);
  });

  permissionsContent.innerHTML = '';
  permissionsContent.appendChild(permissionsList);
}

// Đăng xuất
document.getElementById('logoutBtn')?.addEventListener('click', async function() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Chuyển về trang login
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Vẫn xóa token và chuyển về trang login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
});

// Load user info khi trang load
window.addEventListener('DOMContentLoaded', loadUserInfo);
