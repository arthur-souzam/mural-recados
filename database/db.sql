
CREATE DATABASE IF NOT EXISTS `trabalho_web` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `trabalho_web`;

CREATE TABLE `recados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mensagem` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) 
