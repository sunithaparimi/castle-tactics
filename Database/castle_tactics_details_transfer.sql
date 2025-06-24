-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: castle_tactics
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `details_transfer`
--

DROP TABLE IF EXISTS `details_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `details_transfer` (
  `game_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  KEY `game_id` (`game_id`),
  KEY `user_name` (`user_name`),
  CONSTRAINT `details_transfer_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `game_details` (`game_id`),
  CONSTRAINT `details_transfer_ibfk_2` FOREIGN KEY (`user_name`) REFERENCES `user_details` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `details_transfer`
--

LOCK TABLES `details_transfer` WRITE;
/*!40000 ALTER TABLE `details_transfer` DISABLE KEYS */;
INSERT INTO `details_transfer` VALUES ('1339','akhila','2024-11-17 19:00:32'),('1342','akhila','2024-11-17 19:06:25'),('1348','akhila','2024-11-17 19:29:32'),('1348','suhitha','2024-11-17 19:29:32'),('1349','akhila','2024-11-17 19:40:03'),('1349','suhitha','2024-11-17 19:40:03'),('1350','akhila','2024-11-17 19:45:44'),('1350','suhitha','2024-11-17 19:45:44'),('1351','akhila','2024-11-17 20:01:44'),('1351','suhitha','2024-11-17 20:01:44'),('1352','akhila','2024-11-17 20:08:17'),('1352','suhitha','2024-11-17 20:08:17'),('1353','akhila','2024-11-17 20:13:53'),('1353','suhitha','2024-11-17 20:13:53'),('1354','akhila','2024-11-17 20:21:55'),('1354','suhitha','2024-11-17 20:21:55'),('1357','akhila','2024-11-17 20:31:23'),('1357','suhitha','2024-11-17 20:31:23'),('1358','akhila','2024-11-17 20:40:38'),('1358','suhitha','2024-11-17 20:40:38'),('1359','akhila','2024-11-17 20:54:58'),('1359','suhitha','2024-11-17 20:54:58'),('1360','akhila','2024-11-17 20:56:49'),('1360','suhitha','2024-11-17 20:56:49'),('1361','akhila','2024-11-17 20:58:03'),('1361','suhitha','2024-11-17 20:58:03'),('1362','akhila','2024-11-17 21:16:34'),('1362','suhitha','2024-11-17 21:16:34'),('1363','akhila','2024-11-17 21:18:20'),('1363','suhitha','2024-11-17 21:18:20'),('1364','akhila','2024-11-17 21:20:29'),('1364','suhitha','2024-11-17 21:20:29'),('1365','akhila','2024-11-17 21:26:02'),('1365','suhitha','2024-11-17 21:26:02'),('1366','suhitha','2024-11-17 21:31:21'),('1366','akhila','2024-11-17 21:31:21'),('1367','suhitha','2024-11-18 04:10:04'),('1367','akhila','2024-11-18 04:10:04'),('1368','suhitha','2024-11-18 04:17:51'),('1368','akhila','2024-11-18 04:17:51'),('1371','suhitha','2024-11-18 04:30:58'),('1371','akhila','2024-11-18 04:30:58'),('1372','suhitha','2024-11-18 04:33:02'),('1372','akhila','2024-11-18 04:33:02'),('1374','suhitha','2024-11-18 04:38:54'),('1374','akhila','2024-11-18 04:38:54'),('1376','suhitha','2024-11-18 04:48:01'),('1376','akhila','2024-11-18 04:48:01'),('1377','suhi','2024-11-18 04:50:57'),('1377','suhitha','2024-11-18 04:50:57'),('1378','suhi','2024-11-18 04:55:45'),('1378','suhitha','2024-11-18 04:55:45'),('1380','suhi','2024-11-18 05:00:05'),('1380','suhitha','2024-11-18 05:00:05'),('1381','suhi','2024-11-18 05:04:37'),('1381','suhitha','2024-11-18 05:04:37'),('1382','suhi','2024-11-18 05:07:30'),('1382','suhitha','2024-11-18 05:07:30'),('1383','suhi','2024-11-18 05:12:58'),('1383','suhitha','2024-11-18 05:12:58'),('1384','suhi','2024-11-18 05:14:17'),('1384','suhitha','2024-11-18 05:14:17'),('1385','hakth','2024-11-18 05:20:58'),('1385','harth','2024-11-18 05:20:58'),('1386','pakth','2024-11-18 05:24:24'),('1386','hakth','2024-11-18 05:24:24'),('1387','jayen','2024-11-18 05:28:16'),('1387','pakth','2024-11-18 05:28:16'),('1388','jayen','2024-11-18 05:41:49'),('1388','pakth','2024-11-18 05:41:49'),('1392','jayen','2024-11-18 05:53:13'),('1392','pakth','2024-11-18 05:53:13'),('1393','jayen','2024-11-18 06:35:11'),('1393','jakth','2024-11-18 06:35:11'),('1394','jayen','2024-11-18 06:37:27'),('1394','suhi','2024-11-18 06:37:27'),('1395','jayen','2024-11-18 06:50:56'),('1395','hakth','2024-11-18 06:50:56'),('1398','jayen','2024-11-18 07:02:25'),('1398','akhila','2024-11-18 07:02:25'),('1399','jayen','2024-11-18 07:17:35'),('1399','akhila','2024-11-18 07:17:35'),('1400','jayen','2024-11-18 07:19:29'),('1400','harth','2024-11-18 07:19:29'),('1401','jayen','2024-11-18 07:25:11'),('1401','pakth','2024-11-18 07:25:11'),('1403','suhi','2024-11-18 08:06:52'),('1403','pakth','2024-11-18 08:06:52'),('1407','jayen','2024-11-18 08:41:29'),('1407','hakth','2024-11-18 08:41:29'),('1408','jayen','2024-11-18 08:43:48'),('1408','akhila','2024-11-18 08:43:48'),('1409','jayen','2024-11-18 08:50:40'),('1409','hakth','2024-11-18 08:50:40'),('1411','jayen','2024-11-18 09:31:26'),('1411','hakth','2024-11-18 09:31:26'),('1412','sunitha','2024-11-18 09:33:17'),('1412','akhila','2024-11-18 09:33:17'),('1413','jayen','2024-11-18 09:55:22'),('1413','hakth','2024-11-18 09:55:22'),('1415','jayen','2025-01-13 12:53:03'),('1415','suhi','2025-01-13 12:53:03');
/*!40000 ALTER TABLE `details_transfer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-11 14:15:47
