// Quản lý trạng thái
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let editingId = null;

// Tham chiếu DOM
const courseForm = document.getElementById('course-form');
const courseIdInput = document.getElementById('course-id');
const courseNameInput = document.getElementById('course-name');
const courseTeacherInput = document.getElementById('course-teacher');
const courseTimeInput = document.getElementById('course-time');

const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');

const courseList = document.getElementById('course-list');
const totalCourses = document.getElementById('total-courses');
const emptyState = document.getElementById('empty-state');
const tableResponsive = document.querySelector('.table-responsive');

// Khởi tạo
function init() {
    renderCourses();
    setupEventListeners();
}

function setupEventListeners() {
    courseForm.addEventListener('submit', handleFormSubmit);
    btnCancel.addEventListener('click', resetForm);
}

// Render dữ liệu
function renderCourses() {
    courseList.innerHTML = '';

    if (courses.length === 0) {
        tableResponsive.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tableResponsive.style.display = 'block';
        emptyState.style.display = 'none';

        courses.forEach((course, index) => {
            const tr = document.createElement('tr');
            tr.className = 'row-enter';
            tr.style.animationDelay = `${index * 0.05}s`;

            const teacherInitial = course.teacher ? course.teacher.charAt(0).toUpperCase() : '?';
            const teacherDisplay = course.teacher || '<i>Chưa có</i>';

            tr.innerHTML = `
                <td>
                    <div class="course-name-cell">${escapeHTML(course.name)}</div>
                </td>
                <td>
                    <div class="teacher-cell">
                        ${course.teacher ? `<div class="teacher-avatar">${teacherInitial}</div>` : ''}
                        <span>${course.teacher ? escapeHTML(course.teacher) : teacherDisplay}</span>
                    </div>
                </td>
                <td>
                    <div class="time-cell">
                        <i class="fa-regular fa-clock"></i> ${escapeHTML(course.time)}
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-icon" onclick="editCourse('${course.id}')" title="Sửa">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-danger btn-icon" onclick="deleteCourse('${course.id}')" title="Xóa">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            courseList.appendChild(tr);
        });
    }

    // Cập nhật số lượng
    totalCourses.innerText = courses.length;
}

// Xử lý Form
function handleFormSubmit(e) {
    e.preventDefault();

    const name = courseNameInput.value.trim();
    const teacher = courseTeacherInput.value.trim();
    const time = courseTimeInput.value.trim();

    if (!name || !time) {
        showToast('Vui lòng nhập đầy đủ Tên môn và Thời gian!', 'error');
        return;
    }

    if (editingId) {
        // Cập nhật
        const index = courses.findIndex(c => c.id === editingId);
        if (index !== -1) {
            courses[index] = { ...courses[index], name, teacher, time };
            saveData();
            showToast('Đã cập nhật môn học thành công!', 'success');
            resetForm();
            renderCourses();
        }
    } else {
        // Thêm mới
        const newCourse = {
            id: generateId(),
            name,
            teacher,
            time,
            createdAt: new Date().getTime()
        };
        courses.unshift(newCourse); // Thêm lên đầu
        saveData();
        showToast('Đã thêm môn học mới!', 'success');
        resetForm();
        renderCourses();
    }
}

// Sửa
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    editingId = id;
    courseIdInput.value = course.id;
    courseNameInput.value = course.name;
    courseTeacherInput.value = course.teacher;
    courseTimeInput.value = course.time;

    // Đổi giao diện form
    formTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Cập Nhật Môn Học';
    btnSubmit.innerHTML = '<i class="fa-solid fa-save"></i> Lưu Thay Đổi';
    btnCancel.style.display = 'flex';

    // Scroll to form (chuyên nghiệp)
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    courseNameInput.focus();
}

// Xóa
function deleteCourse(id) {
    if (confirm('Bạn có chắc chắn muốn xóa môn học này không? Hành động này không thể hoàn tác.')) {
        courses = courses.filter(c => c.id !== id);
        saveData();
        showToast('Đã xóa môn học.', 'info');
        renderCourses();
    }
}

// Reset form
function resetForm() {
    editingId = null;
    courseForm.reset();
    courseIdInput.value = '';

    formTitle.innerHTML = '<i class="fa-solid fa-plus-circle"></i> Thêm Môn Học Mới';
    btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Thêm Môn Học';
    btnCancel.style.display = 'none';
}

// Helper - Lưu LocalStorage
function saveData() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Helper - Tạo ID độc nhất
function generateId() {
    return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
}

// Helper - Ngăn chặn XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

// Hệ thống Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <div class="toast-content">
            <div style="font-weight: 600; font-size: 0.95rem;">${type === 'success' ? 'Thành công!' : type === 'error' ? 'Lỗi!' : 'Thông báo'}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Tự động ẩn sau 3s
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300); // Đợi animation kết thúc
    }, 3000);
}

// Khởi chạy App
document.addEventListener('DOMContentLoaded', init);
