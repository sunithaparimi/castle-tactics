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
-- Table structure for table `previously_played`
--

DROP TABLE IF EXISTS `previously_played`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `previously_played` (
  `game_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `score` bigint DEFAULT NULL,
  `user_position` varchar(255) DEFAULT NULL,
  KEY `game_id` (`game_id`),
  KEY `user_name` (`user_name`),
  CONSTRAINT `previously_played_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `game_details` (`game_id`),
  CONSTRAINT `previously_played_ibfk_2` FOREIGN KEY (`user_name`) REFERENCES `user_details` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `previously_played`
--

LOCK TABLES `previously_played` WRITE;
/*!40000 ALTER TABLE `previously_played` DISABLE KEYS */;
INSERT INTO `previously_played` VALUES ('1339','akhila',0,'0.5'),('1342','akhila',0,'0.5'),('1348','akhila',10,'1'),('1348','suhitha',0,'0'),('1349','akhila',20,'1'),('1349','suhitha',10,'0'),('1350','akhila',10,'0'),('1350','suhitha',20,'1'),('1351','akhila',50,'1'),('1351','suhitha',30,'0'),('a56d1b77-a501-11ef-8f14-c475abb9952d',NULL,NULL,NULL),('a56d1b77-a501-11ef-8f14-c475abb9952d',NULL,NULL,NULL),('1352','akhila',10,'0.5'),('1352','suhitha',10,'0.5'),('1353','akhila',20,'1'),('1353','suhitha',0,'0'),('1354','akhila',20,'1'),('1354','suhitha',10,'0'),('1357','akhila',30,'1'),('1357','suhitha',20,'0'),('1358','akhila',10,'0.5'),('1358','suhitha',10,'0.5'),('1359','akhila',10,'1'),('1359','suhitha',0,'0'),('1360','akhila',10,'1'),('1360','suhitha',0,'0'),('1361','akhila',10,'1'),('1361','suhitha',0,'0'),('1362','akhila',20,'1'),('1362','suhitha',0,'0'),('1363','akhila',20,'1'),('1363','suhitha',0,'0'),('1364','akhila',30,'0'),('1364','suhitha',100,'1'),('1365','akhila',20,'0'),('1365','suhitha',90,'1'),('1366','suhitha',10,'0.5'),('1366','akhila',10,'0.5'),('1367','suhitha',170,'1'),('1367','akhila',90,'0'),('1368','suhitha',130,'0'),('1368','akhila',160,'1'),('1371','suhitha',100,'1'),('1371','akhila',0,'0'),('1372','suhitha',100,'0.5'),('1372','akhila',100,'0.5'),('1374','suhitha',170,'1'),('1374','akhila',90,'0'),('1376','suhitha',100,'1'),('1376','akhila',0,'0'),('1377','suhi',100,'1'),('1377','suhitha',0,'0'),('1378','suhi',120,'1'),('1378','suhitha',0,'0'),('1380','suhi',50,'0'),('1380','suhitha',90,'1'),('1381','suhi',10,'0'),('1381','suhitha',90,'1'),('1382','suhi',90,'1'),('1382','suhitha',0,'0'),('1383','suhi',20,'1'),('1383','suhitha',0,'0'),('1384','suhi',20,'1'),('1384','suhitha',0,'0'),('1385','hakth',90,'1'),('1385','harth',0,'0'),('1386','pakth',170,'1'),('1386','hakth',90,'0'),('1387','jayen',170,'1'),('1387','pakth',90,'0'),('1388','jayen',90,'1'),('1388','pakth',0,'0'),('1392','jayen',90,'1'),('1392','pakth',0,'0'),('1393','jayen',60,'1'),('1393','jakth',10,'0'),('1394','jayen',10,'1'),('1394','suhi',0,'0'),('1395','jayen',20,'1'),('1395','hakth',10,'0'),('1398','jayen',20,'1'),('1398','akhila',10,'0'),('6720105d-a57c-11ef-8f14-c475abb9952d',NULL,NULL,NULL),('6720105d-a57c-11ef-8f14-c475abb9952d',NULL,NULL,NULL),('6720105d-a57c-11ef-8f14-c475abb9952d','player1_name',NULL,NULL),('6720105d-a57c-11ef-8f14-c475abb9952d','player2_name',NULL,NULL),('1399','jayen',20,'1'),('1399','akhila',10,'0'),('1400','jayen',260,'1'),('1400','harth',0,'0'),('1401','jayen',10,'1'),('1401','pakth',0,'0'),('1403','suhi',10,'1'),('1403','pakth',0,'0'),('1407','jayen',0,'0'),('1407','hakth',90,'1'),('1408','jayen',290,'1'),('1408','akhila',0,'0'),('1409','jayen',180,'1'),('1409','hakth',0,'0'),('1411','jayen',10,'1'),('1411','hakth',0,'0'),('1412','sunitha',0,'0.5'),('1412','akhila',0,'0.5'),('1413','jayen',10,'1'),('1413','hakth',0,'0'),('1415','jayen',10,'1'),('1415','suhi',0,'0');
/*!40000 ALTER TABLE `previously_played` ENABLE KEYS */;
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
