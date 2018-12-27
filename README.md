# HJC-Playground

(Version mới nhất luôn cập nhật tại nhánh master)

Được phát triển bởi **Nhóm 4players** - trường ĐH Công nghệ - ĐHQGHN:
  - Nguyễn Văn Dương
  - Vũ Tùng Dương
  - Nguyễn Trí Công
  - Phạm Việt Hoàng

**HJC-Playground** là website thông dịch mã nguồn HTML, CSS, Javascript.

## Các chức năng chính :
  - Edit code và hiển thị kết quả.
  - Hỗ trợ edit code: auto completation, suggestion code, colorpicker, tìm thư viện (cdnjs) ...
  - Quản lí project.
  - Chia sẻ project cho người khác.
 
 ## Các công nghệ sử dụng cho project:
  - Back-end: NodeJS, ExpressJS, MySQL.
  - Front-end: AngularJS, Bootstrap, Code-mirror, template Metronic_v4.

## Cách cài đặt: 
  ---- Yêu cầu: nodejs, npm, mysql.

  - git clone https://github.com/vanduong185/HJC-Playground
  - Xoá package-lock.json
  - npm install
  - Vào file hjc_db.js tùy chỉnh cấu hình Mysql của bạn.
  - Trong Mysql tạo cơ sở dữ liệu hjc_playground, sau đó import file hjc_playground.sql vào cơ sở dữ liệu vừa tạo.
  - npm start
