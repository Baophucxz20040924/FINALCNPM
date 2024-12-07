const loginBtn = document.getElementById('login-btn');
const messageDiv = document.getElementById('message');

loginBtn.addEventListener('click', async () => {
    // Lấy giá trị từ form
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Kiểm tra giá trị đầu vào
    if (!username || !password) {
        messageDiv.textContent = 'Vui lòng điền đầy đủ thông tin!';
        messageDiv.className = 'error';
        return;
    }

    try {
        // Gửi API
        const response = await fetch('http://localhost:4000/api/accounts/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        // Xử lý kết quả
        if (response.ok) {
            messageDiv.textContent = 'Đăng nhập thành công!';
            messageDiv.className = 'success';
            localStorage.setItem("account_id", result._id);
            if (result.role === 'admin') {
                window.location.href = '../admin';
            } else {
                window.location.href = '../user';
            }
            // Chuyển hướng sau khi đăng nhập thành công (nếu cần)
            // window.location.href = 'dashboard.html';
        } else {
            messageDiv.textContent = result.message || 'Đăng nhập thất bại!';
            messageDiv.className = 'error';
        }
    } catch (error) {
        messageDiv.textContent = 'Có lỗi xảy ra khi kết nối tới server!';
        messageDiv.className = 'error';
    }
});