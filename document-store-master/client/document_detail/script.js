// Hàm lấy `document_id` từ URL
const getDocumentIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('document_id');
};

// Hiển thị chi tiết tài liệu
const displayDocumentDetails = (doc) => {
    const detailsContainer = document.getElementById('document-details');
    const createdAt = new Date(doc.createdAt).toLocaleString();

    const imagesHTML = doc.images.map(img => `
        <img style="width: 20%;" src="http://localhost:4000/${img}" alt="Document Image">
    `).join('');

    detailsContainer.innerHTML = `
        <div class="details">
            <p><strong>Tiêu đề:</strong> ${doc.title}</p>
            <p><strong>Mô tả:</strong> ${doc.description}</p>
            <p class="price"><strong>Giá:</strong> ${doc.price.toLocaleString()} VNĐ</p>
            <p><strong>Ngày tạo:</strong> ${createdAt}</p>
        </div>
        <div class="images">
            ${imagesHTML}
        </div>
        <button class="download" onclick="handleBuy('${doc._id}')">
            Tải xuống tài liệu
        </button>
    `;
};

// Gọi API để lấy chi tiết tài liệu
const fetchDocumentDetails = async (id) => {
    try {
        const response = await fetch(`http://localhost:4000/api/documents/${id}`);
        if (!response.ok) {
            throw new Error('Không thể lấy chi tiết tài liệu');
        }
        const doc = await response.json();
        displayDocumentDetails(doc);
    } catch (error) {
        console.error(error);
        alert('Đã xảy ra lỗi khi tải chi tiết tài liệu.');
    }
};

// Khi trang được tải
window.onload = () => {
    const documentId = getDocumentIdFromURL();
    if (documentId) {
        fetchDocumentDetails(documentId);
    } else {
        alert('Không tìm thấy ID tài liệu trong URL');
    }
};


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
