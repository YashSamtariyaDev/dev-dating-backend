-- Truncate all tables in the correct order (respect foreign keys)
-- Run this in MySQL CLI: mysql -u root -p dev_dating < scripts/truncate-all.sql

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `swipes`;
TRUNCATE TABLE `matches`;
TRUNCATE TABLE `user_actions`;
TRUNCATE TABLE `profiles`;
TRUNCATE TABLE `users`;

SET FOREIGN_KEY_CHECKS = 1;
