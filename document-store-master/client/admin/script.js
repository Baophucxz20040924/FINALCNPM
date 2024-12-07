const createBtn = document.getElementById('create-btn');
const documentList = document.getElementById('document-list');

// API base URL
const API_BASE = 'http://localhost:4000/api/documents';

// Tạo tài liệu mới
createBtn.addEventListener('click', async () => {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value.trim();
    const file = document.getElementById('file').files[0];
    const imgFiles = document.getElementById('img').files;

    if (!title || !description || !price || !file) {
        alert('Vui lòng điền đầy đủ thông tin và chọn tệp!');
        return;
    }

    if (imgFiles.length > 5) {
        alert('Chỉ được tải lên tối đa 5 hình ảnh!');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('file', file);

    for (let i = 0; i < imgFiles.length; i++) {
        formData.append('img', imgFiles[i]);
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Tài liệu được tạo thành công!');
            loadDocuments(); // Tải lại danh sách tài liệu
        } else {
            alert('Có lỗi xảy ra khi tạo tài liệu.');
        }
    } catch (error) {
        console.error(error);
        alert('Không thể kết nối tới server.');
    }
});


// Xóa tài liệu
const deleteDocument = async (id) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa tài liệu này?");
    if (!confirmDelete) {
        return; // Người dùng từ chối xóa
    }

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Xóa tài liệu thành công!');
            loadDocuments(); // Tải lại danh sách tài liệu
        } else {
            alert('Không thể xóa tài liệu.');
        }
    } catch (error) {
        console.error(error);
        alert('Không thể kết nối tới server.');
    }
};

// Tải danh sách tài liệu
const loadDocuments = async () => {
    try {
        const response = await fetch(API_BASE);
        const documents = await response.json();

        documentList.innerHTML = '';
        documents.forEach((doc) => {
            const row = document.createElement('tr');
            row.innerHTML = `
    <td>${doc.title}</td>
    <td>${doc.description}</td>
    <td>${doc.price.toLocaleString()} VNĐ</td>
    <td>
        <button class="delete-btn" onclick="deleteDocument('${doc._id}')">Xóa</button>
        <a class="delete-btn" href="../document_detail/index.html?document_id=${doc._id}">Chi tiết</a>
    </td>
  `;
            documentList.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert('Không thể tải danh sách tài liệu.');
    }
};

// Tải danh sách tài liệu khi trang được tải
window.onload = loadDocuments;