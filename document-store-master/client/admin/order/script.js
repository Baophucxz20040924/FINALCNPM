const tableBody = document.querySelector('#orderTable tbody');

function displayOrders(orders) {
    orders.forEach(order => {
        const row = document.createElement('tr');

        // ID đơn hàng
        const orderId = document.createElement('td');
        orderId.textContent = order._id;
        row.appendChild(orderId);

        // Tài khoản
        const account = document.createElement('td');
        account.textContent = order.account_id.username;
        row.appendChild(account);

        // Tài liệu (document_id.title)
        const documentCell = document.createElement('td');
        if (order.document_id === null) {
            documentCell.textContent = "Đã xóa";
            documentCell.classList.add('deleted');
        } else {
            documentCell.textContent = order.document_id.title;
        }

        row.appendChild(documentCell);

        // giá (document_id.price)
        const priceCell = document.createElement('td');
        if (order.document_id === null) {
            priceCell.textContent = "Đã xóa";
            priceCell.classList.add('deleted');
        } else {
            priceCell.textContent = order.document_id.price + " đ";
        }

        row.appendChild(priceCell);

        // Phương thức thanh toán
        const paymentMethod = document.createElement('td');
        paymentMethod.textContent = order.payment_method;
        row.appendChild(paymentMethod);

        // Trạng thái
        const status = document.createElement('td');
        status.textContent = order.status;
        row.appendChild(status);

        // Mã giao dịch
        const transactionId = document.createElement('td');
        transactionId.textContent = order.transaction_id;
        row.appendChild(transactionId);

        // Ngày tạo
        const createdAt = document.createElement('td');
        createdAt.textContent = new Date(order.createdAt).toLocaleString();
        row.appendChild(createdAt);

        tableBody.appendChild(row);
    });
}

// Hàm gọi API và lấy dữ liệu
function fetchOrders() {
    fetch('http://localhost:4000/api/orders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Mất kết nối với API');
            }
            return response.json();
        })
        .then(data => {
            // Truyền dữ liệu vào hàm displayOrders
            displayOrders(data);
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
}

// Gọi hàm fetchOrders khi trang tải xong
window.onload = fetchOrders;
