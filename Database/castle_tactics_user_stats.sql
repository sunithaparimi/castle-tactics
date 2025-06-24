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
-- Table structure for table `user_stats`
--

DROP TABLE IF EXISTS `user_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_stats` (
  `user_name` varchar(255) DEFAULT NULL,
  `user_rank` bigint DEFAULT NULL,
  `prev_avg_time` time DEFAULT NULL,
  `prev_accuracy` float DEFAULT NULL,
  `no_of_games_played` bigint DEFAULT NULL,
  `no_of_drawn` bigint DEFAULT NULL,
  `no_of_won` bigint DEFAULT NULL,
  `no_of_lost` bigint DEFAULT NULL,
  `win_percentage` float DEFAULT NULL,
  `avg_score` float DEFAULT NULL,
  `coins` bigint DEFAULT NULL,
  KEY `user_name` (`user_name`),
  CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`user_name`) REFERENCES `user_details` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_stats`
--

LOCK TABLES `user_stats` WRITE;
/*!40000 ALTER TABLE `user_stats` DISABLE KEYS */;
INSERT INTO `user_stats` VALUES ('suhitha',NULL,NULL,NULL,9,0,4,5,NULL,NULL,350),('akhila',NULL,NULL,NULL,6,1,0,5,NULL,NULL,325),('suhi',NULL,NULL,NULL,4,0,2,2,NULL,NULL,250),('hakth',NULL,NULL,NULL,7,0,2,5,NULL,NULL,150),('harth',NULL,NULL,NULL,2,0,0,2,NULL,NULL,50),('pakth',3,NULL,NULL,6,0,1,5,NULL,NULL,100),('jayen',1,NULL,NULL,16,0,15,1,NULL,NULL,100),('jakth',NULL,NULL,NULL,1,0,0,1,NULL,NULL,0),('nayen',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300),('kavya',NULL,NULL,NULL,0,0,0,0,NULL,NULL,250),('suni',NULL,NULL,NULL,0,0,0,0,NULL,NULL,250),('sunitha',NULL,NULL,NULL,1,1,0,0,NULL,NULL,325),('gayatri',NULL,NULL,NULL,0,0,0,0,NULL,NULL,300);
/*!40000 ALTER TABLE `user_stats` ENABLE KEYS */;
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
