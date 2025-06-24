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
-- Table structure for table `user_details`
--

DROP TABLE IF EXISTS `user_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_details` (
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `notification_status` bit(1) DEFAULT NULL,
  `availability` bit(1) DEFAULT NULL,
  PRIMARY KEY (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_details`
--

LOCK TABLES `user_details` WRITE;
/*!40000 ALTER TABLE `user_details` DISABLE KEYS */;
INSERT INTO `user_details` VALUES ('',NULL,NULL,_binary '',_binary ''),('akhila','$2b$12$GNdFbRYHHVllXlgCMJ1J2.yoVCJkvtIh3KteveNcfw0b4bKJiCyXS','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('gayatri','$2b$12$XLfC29QGfEe41UBGQb1qZuN2wtUK7SA21yFOrOj38aRWRaLAhgndO','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('hakth','$2b$12$CLkBef4bL8DsUF87JuwDveVOdqcAKuFYPeJ2MttuGjoA1gGTyGM0m','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('harth','$2b$12$/h71SVlTzIaqDwsFu5wpiOVxrzcBozlj1AdTQdWGS8of93/29lq/W','suhithaannamareddi@gmail.com',_binary '',NULL),('jakth','$2b$12$MPWQPAmN5k0xyD54jEE8Au7qCwnCY45rsK2oc9uwKu9mzY/ywRR/i','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('jayen','$2b$12$OF31rvz8nBHZmm2N8UvVnODuk2/cAaFrwcHI0m.HWlOu0/WnhXb6K','suhithaannamareddi@gmail.com',_binary '\0',_binary '\0'),('kavya','$2b$12$veMOiMyVwVl5g2wEqhCdG.zu.vrSY4eQ6u5DSZtnAd9ljDtOVzF3m','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('nayen','$2b$12$UEvyANLrfgvnuzSO01n3/OySvYoDrLue27GtGIMQnyt.uULJz5ABq','suhithaannamareddi@gmail.com',_binary '\0',_binary '\0'),('pakth','$2b$12$12Mxfk5uvURdH0yBggTBcOS51dN65Azi1vmrQu/G5HyXylgfLCt2K','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('player1_name',NULL,NULL,_binary '',_binary ''),('player2_name',NULL,NULL,_binary '',_binary ''),('suhi','$2b$12$nN2IEBISMrML2zUTDljna./fdRXY7Ej0xobguQBsCiYxfr7XZkOj2','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('suhitha','$2b$12$4n7z/E/H1AlGH/x74ZNAw.ln9Xur2AH/VsUfKUnkvwXdYXvwwvh1y','suhithaannamareddi@gmail.com',_binary '\0',_binary '\0'),('suni','$2b$12$QFrbjXeJilwMEjHdP0zn.O3DjKCSm.aVomoqs.fAGfZkHq8Jsx666','suhithaannamareddi@gmail.com',_binary '',_binary '\0'),('sunitha','$2b$12$NgoPSBRuq/oVzjpB44/q2ePlS3oI4t.CCQWIJra9Mi6r5qhfWGkXG','suhithaannamareddi@gmail.com',_binary '',_binary '\0');
/*!40000 ALTER TABLE `user_details` ENABLE KEYS */;
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
