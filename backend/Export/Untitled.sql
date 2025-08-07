CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `lastname` varchar(100),
  `firstname` varchar(100),
  `email` varchar(250),
  `password` varchar(250)
);

CREATE TABLE `ideas` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `title` varchar(100),
  `created_at` timestamp,
  `categories_id` integer NOT NULL,
  `content` text
);

CREATE TABLE `categories` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100)
);

CREATE TABLE `comments` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `idea_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `content` text,
  `created_at` timestamp
);

CREATE TABLE `votes` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `idea_id` integer NOT NULL,
  `user_id` integer NOT NULL
);

ALTER TABLE `ideas` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `ideas` ADD FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`);

ALTER TABLE `votes` ADD FOREIGN KEY (`idea_id`) REFERENCES `ideas` (`id`);

ALTER TABLE `votes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`idea_id`) REFERENCES `ideas` (`id`);
