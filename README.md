# Rewards Helper

Một tiện ích mở rộng cho trình duyệt Chrome giúp tự động hóa việc tìm kiếm trên Bing để tích lũy điểm Microsoft Rewards một cách hiệu quả. Tiện ích được xây dựng với Manifest V3, đảm bảo hiệu suất cao và tuân thủ các tiêu chuẩn bảo mật mới nhất.

> Đây là bản fork được duy trì bởi KhanhTin-Jin (Jin). Mã nguồn gốc và thông báo bản quyền của tác giả trước vẫn được giữ nguyên theo giấy phép MIT.

 <!-- Thay thế bằng URL ảnh chụp màn hình popup của bạn -->

## ✨ Tính năng nổi bật

- ✨ **Lên lịch thông minh:** Tự động hẹn giờ chạy ngâm theo chu kỳ linh hoạt (1 ngày, 1 tuần, 1 tháng, 1 năm). Tới giờ hệ thống sẽ hiển thị pop-up thông báo để người dùng xác nhận chạy tìm kiếm (yêu cầu trình duyệt đang mở).
- **Tự động tìm kiếm:** Thực hiện một chuỗi các tìm kiếm tuần tự trong một tab duy nhất để mô phỏng hành vi người dùng tự nhiên.
- **Tùy chỉnh linh hoạt:**
  - Điều chỉnh **số lượng tìm kiếm** cho mỗi lần chạy.
  - Thiết lập **thời gian chờ** giữa các lần tìm kiếm (tức thì, cố định, hoặc ngẫu nhiên).
- **Chủ đề tìm kiếm đa dạng:**
  - Sử dụng danh sách chủ đề tìm kiếm phong phú được tích hợp sẵn.
  - Tự tạo danh sách chủ đề của riêng bạn thông qua giao diện hoặc tải lên tệp `.txt`.

- **Giao diện trực quan:**
  - **Popup** cho phép điều khiển nhanh (Bắt đầu/Dừng) và xem trạng thái.
  - **Trang Cài đặt** đầy đủ với sidebar để quản lý chi tiết các tùy chọn.
- **An toàn và riêng tư:** Tiện ích chỉ tương tác với tên miền của Bing và không thu thập bất kỳ dữ liệu cá nhân nào của người dùng.

## 🚀 Cài đặt

Vì tiện ích này chưa được xuất bản trên Chrome Web Store, bạn cần cài đặt thủ công theo các bước sau:

1.  **Tải mã nguồn:**
    - Tải về dự án dưới dạng tệp `.zip` bằng cách nhấn vào `Code` > `Download ZIP`.
    - Giải nén tệp vừa tải về vào một thư mục bất kỳ.

2.  **Cài đặt vào Edge:**
    - Mở trình duyệt Chrome và truy cập `edge://extensions`.
    - Bật **Chế độ dành cho nhà phát triển** (Developer mode) ở tab trên bên trái.
    - Nhấn vào nút **Tải tiện ích đã giải nén** (Load unpacked).
    - Chọn thư mục mà bạn đã giải nén ở bước 1.

3.  **Hoàn tất:**
    - Biểu tượng của tiện ích "Rewards Helper" sẽ xuất hiện trên thanh công cụ của Edge. Bạn có thể ghim nó để truy cập nhanh hơn.

## 📖 Hướng dẫn sử dụng

1.  **Mở Popup:** Nhấn vào biểu tượng tiện ích trên thanh công cụ để mở popup điều khiển.
    - **Start:** Bắt đầu phiên tìm kiếm thủ công.
    - **Stop:** Dừng phiên tìm kiếm đang chạy.
    - **Cài đặt:** Mở trang cài đặt chi tiết.

2.  **Trang Cài đặt:**
    - **Cài đặt chung:** Điều chỉnh số lượt tìm kiếm và cơ chế delay.
    - **Chủ đề tùy chỉnh:** Thêm danh sách từ khóa tìm kiếm của riêng bạn.
    - **Lên lịch:** Cấu hình chu kỳ (ngày, tuần, tháng, năm), thời gian nhắc nhở, và thời gian chờ (delay) trước khi thực hiện các tìm kiếm tiếp theo của lịch tự động.
    - **Giới thiệu:** Xem thông tin phiên bản và nhật ký thay đổi.

## 🛠️ Dành cho nhà phát triển (Development)

Dự án được cấu trúc một cách module hóa để dễ dàng bảo trì và mở rộng.

- **`background.js`**: Service worker xử lý tất cả logic lõi (tìm kiếm, lên lịch, quản lý trạng thái). Các hàm được tách biệt rõ ràng (`getSettings`, `selectSearchTopics`, `runSearchSession`).
- **`options.js`**: Logic cho trang cài đặt được chia thành các module:
  - `UI`: Quản lý các tương tác với DOM.
  - `Storage`: Đóng gói các lệnh gọi tới `chrome.storage`.
  - `App`: Controller chính, liên kết các sự kiện và logic.
- **`popup.js`**: Xử lý giao diện và các sự kiện trên popup.

### Debugging

- Để gỡ lỗi cho **background script**, truy cập `chrome://extensions`, tìm tiện ích "Rewards Helper" và nhấp vào liên kết "service worker".
- Để gỡ lỗi cho **popup** hoặc **trang cài đặt**, chuột phải vào giao diện của chúng và chọn "Kiểm tra" (Inspect).

## 🤝 Đóng góp

Mọi đóng góp để cải thiện dự án đều được hoan nghênh. Vui lòng tạo một "Issue" để thảo luận về các thay đổi lớn hoặc tạo một "Pull Request" nếu bạn có các bản sửa lỗi hoặc cải tiến.

---


<p align="center">Rewards Helper fork by KhanhTin-Jin (Jin) - original by minibom4 - Version 1.1</p>

