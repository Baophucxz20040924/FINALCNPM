const registerBtn = document.getElementById('register-btn');
const messageDiv = document.getElementById('message');

registerBtn.addEventListener('click', async () => {
    // Lấy giá trị từ form
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Kiểm tra giá trị đầu vào
    if (!username || !password || !confirmPassword) {
        messageDiv.textContent = 'Vui lòng điền đầy đủ thông tin!';
        messageDiv.className = 'error';
        return;
    }

    if (password !== confirmPassword) {
        messageDiv.textContent = 'Mật khẩu xác nhận không khớp!';
        messageDiv.className = 'error';
        return;
    }

    try {
        // Gửi API
        const response = await fetch('http://localhost:4000/api/accounts/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        // Xử lý kết quả
        if (response.ok) {
            messageDiv.textContent = 'Đăng ký thành công!';
            messageDiv.className = 'success';
        } else {
            messageDiv.textContent = result.message || 'Đăng ký thất bại!';
            messageDiv.className = 'error';
        }
    } catch (error) {
        messageDiv.textContent = 'Có lỗi xảy ra khi kết nối tới server!';
        messageDiv.className = 'error';
    }
});