-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: employeetrack
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `department` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `salary` varchar(45) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'johngoodman@gmail.com','$2a$10$pcCx3Ye8nf71lkpOiVHJEuDBmL3wD0UcALDo.uo9VAD0Hqpv9YsjO','John','Goodman','HR','USER','HR Specialist','$50,000','(612) 548-9876'),(2,'tyrabanks@gmail.com','$2a$10$mKD/bojOku.Zz2GGSCHI/Oq6MpjyccCAS0WsZ080.s6rHXkhhJtIC','Tyra','Banks','IT','USER','Help Desk Specialist','$60,000','(948) 541-6749'),(3,'tomhanks@gmail.com','$2a$10$mKD/bojOku.Zz2GGSCHI/Oq6MpjyccCAS0WsZ080.s6rHXkhhJtIC','Tom','Hanks','Accounting','USER','Accountant','$50,000','(394) 439-3985'),(4,'braddpitt@gmail.com','$2a$10$mKD/bojOku.Zz2GGSCHI/Oq6MpjyccCAS0WsZ080.s6rHXkhhJtIC','Bradd','Pitt','Marketing','USER','Marketing Specialist','$40,000','(204) 837-5829'),(5,'willsmith@gmail.com','$2a$10$mKD/bojOku.Zz2GGSCHI/Oq6MpjyccCAS0WsZ080.s6rHXkhhJtIC','Will','Smith','Sales','USER','Salesman','$58,000','(912) 739-1945'),(6,'tomcruise@gmail.com','$2a$10$mKD/bojOku.Zz2GGSCHI/Oq6MpjyccCAS0WsZ080.s6rHXkhhJtIC','Tom','Cruise','Operations','USER','CEO','$300,000','(907) 387-8109'),(7,'shootermcgavin@gmail.com','$2a$12$CM.8EYO7ysQYNxanBSEe9OHnW78J1s0H/pRr7RgQmd8EGI806P6pK','Shooter','McGavin','IT','ADMIN','System Administrator','$90,000','(873) 734-5318'),(8,'johndutton@gmail.com','$2a$10$Poa8E8SjDJ0yTDLjOPGvg.gaizqM44p.nmUijPJ4H7rdISnpBirHu','John','Dutton','Sales','MANAGER','Sales Manager','$120,000','(846) 912-8312');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-29 14:36:25
