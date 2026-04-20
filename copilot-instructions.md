# Hướng dẫn Phát triển & Kế hoạch Implement (Copilot Instructions)

Dự án này là một Chrome/Edge Extension hỗ trợ tự động hoá các tìm kiếm hàng ngày để kiếm điểm Microsoft Rewards.

## Kế hoạch phát triển tính năng Lên lịch Tự động chạy ngầm (Scheduled Background Search)

Tóm tắt yêu cầu:
- Sinh lịch báo chạy theo tần suất: `1 ngày`, `1 tuần`, `1 tháng`, `1 năm`.
- Người dùng quy định giờ sẽ chạy.
- Cho phép người dùng tùy chỉnh "delay bao lâu thì search tiếp" cho phiên chạy đó.
- Hiển thị Popup/Notification yêu cầu người dùng **Chấp nhận (Accept)** thì mới bắt đầu vào luồng tìm kiếm ngầm. Khi báo alarm, condition là Extension background chỉ kích hoạt khi trình duyệt Edge đang mở.

### Bước 1: Cập nhật quyền (Permissions) trong Manifest
- Thêm quyền `"notifications"` vào mảng `permissions` trong `manifest.json`.

### Bước 2: Bố trí lại Giao diện Tùy chỉnh (options.html & options.js)
- Thêm phần/tab "Lên lịch tự động" vào thanh bên.
- Thêm form nhập dữ liệu gồm: Bật/Tắt hẹn giờ, Dropdown chọn Tần suất (Ngày, Tuần, Tháng, Năm), Input Giờ tự động nhắc nhở (Time), Input Delay riêng (hoặc tái sử dụng Delay chung).
- Cập nhật hàm lưu mảng Setting này xuống `chrome.storage.local`.
- Gửi IPC Message báo cho `background.js` cần phải làm mới Alarm.

### Bước 3: Logic tính toán Cài đặt Alarm trong Background
- Từ cấu hình giờ và tần suất, `background.js` sẽ tìm được `nextTickTime`.
- Dùng `chrome.alarms.create("scheduleSearch", { when: nextTickTime })`.
- Đảm bảo trong lần run đầu chưa được tính, khi alarm tick và thực thi xong (hoặc lúc báo động), ta tính toán lại nextTickTime và gán chu kỳ mới.

### Bước 4: Thông báo cho Người dùng (Notifications)
- Lắng nghe `chrome.alarms.onAlarm`.
- Nếu name là "scheduleSearch", gọi `chrome.notifications.create` sinh một Rich Notification có Type = basic, với các Button lựa chọn (`Chấp nhận` / `Từ chối`).
- Bắt sự kiện `chrome.notifications.onButtonClicked`. Nếu User nhấn `Chấp nhận`, sử dụng module mở tab tuần tự đã có (mod lại 1 chút để ứng dụng delay setting nếu set riêng) để khởi chạy phiên Auto Search.
