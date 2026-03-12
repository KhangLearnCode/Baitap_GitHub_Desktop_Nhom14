const API_URL = 'http://localhost:5000/api';

// Tab switching
document.getElementById('loginTab')?.addEventListener('click', function() {
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('registerTab').classList.remove('active');
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
});

document.getElementById('registerTab')?.addEventListener('click', function() {
  document.getElementById('registerTab').classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
  document.getElementById('registerForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
});

// Login form submission
document.getElementById('loginFormElement')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Hiển thị thông báo thành công
      messageDiv.className = 'message success';
      messageDiv.textContent = data.message;

      // Chuyển hướng đến dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      messageDiv.className = 'message error';
      messageDiv.textContent = data.message;
    }
  } catch (error) {
    console.error('Login error:', error);
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Không thể kết nối đến server';
  }
});

// Register form submission
document.getElementById('registerFormElement')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const role = document.getElementById('registerRole').value;
  const messageDiv = document.getElementById('registerMessage');

  // Kiểm tra mật khẩu khớp
  if (password !== confirmPassword) {
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Mật khẩu xác nhận không khớp';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, role })
    });

    const data = await response.json();

    if (data.success) {
      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Hiển thị thông báo thành công
      messageDiv.className = 'message success';
      messageDiv.textContent = data.message;

      // Chuyển hướng đến dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      messageDiv.className = 'message error';
      messageDiv.textContent = data.message;
    }
  } catch (error) {
    console.error('Register error:', error);
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Không thể kết nối đến server';
  }
});
