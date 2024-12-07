// Hàm hiển thị danh sách tài liệu
function displayDocuments(documents) {
    const tableBody = document.querySelector('#documentsTable tbody');
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ trong bảng

    documents.forEach(doc => {
        const row = document.createElement('tr');

        // Tiêu đề tài liệu
        const title = document.createElement('td');
        title.textContent = doc.title;
        row.appendChild(title);

        // Mô tả tài liệu
        const description = document.createElement('td');
        description.textContent = doc.description;
        row.appendChild(description);

        // Giá tài liệu
        const price = document.createElement('td');
        price.textContent = new Intl.NumberFormat().format(doc.price) + " VNĐ";
        row.appendChild(price);

        // Nút mua
        const action = document.createElement('td');
        const buyButton = document.createElement('button');
        buyButton.textContent = 'Mua';
        buyButton.onclick = () => handleBuy(doc._id); // Xử lý sự kiện mua tài liệu

        const a = document.createElement("a");
        a.href = `../document_detail/index.html?document_id=${doc._id}`
        a.innerHTML = "Chi tiết"; 
        a.classList.add("delete-btn")
        

        action.appendChild(buyButton);
        action.appendChild(a)
        row.appendChild(action);

        tableBody.appendChild(row);
    });
}

// Hàm gọi API để lấy danh sách tài liệu
function fetchDocuments(titleSearch) {
    fetch('http://localhost:4000/api/documents?title=' + titleSearch)
        .then(response => response.json())
        .then(data => {
            displayDocuments(data);
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
}

const ip_search = document.getElementById("ip_search");
ip_search.addEventListener("keydown", (event) => {
    fetchDocuments(event.target.value);
})

// Hàm xử lý mua tài liệu
function handleBuy(documentId) {
    const accountId = localStorage.getItem('account_id'); // Lấy account_id từ localStorage

    if (!accountId) {
        alert('Bạn phải đăng nhập để thực hiện giao dịch!');
        return;
    }

    const orderData = {
        account_id: accountId,
        document_id: documentId,
        payment_method: 'momo'
    };

    // Gửi yêu cầu mua tài liệu
    fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(order => {
        // Khi nhận được kết quả trả về, mở tab mới với link thanh toán
        if (order.resultCode === 0) {
            window.open(order.shortLink, '_blank'); // Mở tab mới với link thanh toán
        } else {
            alert('Đặt hàng không thành công!');
        }
    })
    .catch(error => {
        console.error('Lỗi khi gọi API đặt hàng:', error);
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
    });
}

// Gọi API khi trang tải
window.onload = fetchDocuments;
