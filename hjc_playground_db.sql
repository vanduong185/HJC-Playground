-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 12, 2018 lúc 10:16 AM
-- Phiên bản máy phục vụ: 5.7.24-0ubuntu0.16.04.1-log
-- Phiên bản PHP: 7.0.32-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hjc_playground`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `author_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `author_id`) VALUES
(1, 'first_proj', 1),
(2, 'second_proj', 1),
(20, 'haha', 2),
(21, 'haha', 1),
(22, 'tuan anh', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shared_projects`
--

CREATE TABLE `shared_projects` (
  `shared_project_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `viewer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `shared_projects`
--

INSERT INTO `shared_projects` (`shared_project_id`, `project_id`, `viewer_id`) VALUES
(5, 20, 1),
(14, 1, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `jobtitle` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isAdmin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `nickname`, `age`, `jobtitle`, `avatar`, `isAdmin`) VALUES
(1, 'vanduong@gmail.com', '$2b$10$8.mzfOLI/Ml.T.Au4W4BMuvTHPSpupGlm6cboktJZV3V2vj87BjFm', 'Duongnvdz', 20, 'student', 'lib/images/avatar/1/avatar1.jpg', 0),
(2, 'admin@gmail.com', '$2b$10$8.mzfOLI/Ml.T.Au4W4BMuvTHPSpupGlm6cboktJZV3V2vj87BjFm', 'admin', 20, 'PhD', NULL, 1),
(3, 'other@gmail.com', '123456', 'other', 22, 'student', NULL, 0),
(4, 'abc@a.com', '$2a$10$21CkGsBvDR2qDmbiLGbbXOG5yVnCtyjHHr6TvL69Uj7DSl7BttNwy', 'aba', NULL, NULL, NULL, 0),
(5, 'nvdaa@c.com', '$2a$10$yJwz3rarHgMzMfEgenyKnOCK8HQgXunA8zHEdJ9SPyp7jH9Nz4zNy', 'asdasd', NULL, NULL, NULL, 0),
(6, 'helo@a.com', '$2a$10$xVD.MG8VS3MvD0OIGZreBe0GE3bwMjK9EdqIXHlVFfwywuA9ltYGK', 'acac', NULL, NULL, NULL, 0),
(7, 'test@abc.com', '$2a$10$1HTphp9poCBMNumYU67wHu3Zmz7yjZOKvcMa.aT5/rhZA0edwCww6', 'duongdz', 20, 'dev', 'lib/images/avatar/1/avatar-_MG_5398.jpg', 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Chỉ mục cho bảng `shared_projects`
--
ALTER TABLE `shared_projects`
  ADD PRIMARY KEY (`shared_project_id`),
  ADD KEY `viewer_id` (`viewer_id`),
  ADD KEY `shared_projects_ibfk_2` (`project_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT cho bảng `shared_projects`
--
ALTER TABLE `shared_projects`
  MODIFY `shared_project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `shared_projects`
--
ALTER TABLE `shared_projects`
  ADD CONSTRAINT `shared_projects_ibfk_1` FOREIGN KEY (`viewer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `shared_projects_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
