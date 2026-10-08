# huong-sac-viet-v2

## Cập nhật danh sách tiết mục

Các card trong mục Chương trình được tải từ [`data/programs.json`](./data/programs.json). Thêm hoặc sửa một đối tượng trong mảng JSON với các trường:

- `title`: tiêu đề tiết mục.
- `tag`: nhãn thể loại hoặc thành tích.
- `description`: phần mô tả.
- `videoUrl`: link Google Drive dạng `https://drive.google.com/file/d/FILE_ID/preview`.

Ảnh thumbnail được tạo tự động từ mã tệp trong `videoUrl`. Sau khi cập nhật tệp JSON, tải lại trang để xem thay đổi.

Do trình duyệt không cho `fetch` tệp JSON từ `file://`, hãy xem website qua máy chủ web cục bộ hoặc dịch vụ lưu trữ hiện tại.
