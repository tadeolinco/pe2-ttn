-- MySQL dump 10.13  Distrib 5.7.21, for Linux (x86_64)
--
-- Host: localhost    Database: pe2_ttn
-- ------------------------------------------------------
-- Server version	5.7.21-0ubuntu0.17.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `pe2_ttn`
--

CREATE DATABASE IF NOT EXISTS `pe2_ttn` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `pe2_ttn`;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` int(11) NOT NULL,
  `opponentScore` int(11) NOT NULL,
  `dateCreated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `studentId` int(11) DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_503d8d03a6686c7dfb0ea62cc9c` (`studentId`),
  KEY `fk_6104095d986e7eec06cbdbe4639` (`teamId`),
  CONSTRAINT `fk_503d8d03a6686c7dfb0ea62cc9c` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_6104095d986e7eec06cbdbe4639` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instructor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (1,'test','test');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `section` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `instructorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_3b160b82b21f9747f5b7727b25b` (`instructorId`),
  CONSTRAINT `fk_3b160b82b21f9747f5b7727b25b` FOREIGN KEY (`instructorId`) REFERENCES `instructor` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
INSERT INTO `section` VALUES (1,'AB1',1),(2,'YZ3',1),(3,'WX2',1);
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `studentNumber` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `willPlaySingles` tinyint(4) NOT NULL,
  `willPlayDoubles` tinyint(4) NOT NULL,
  `sectionId` int(11) DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `studentNumber` (`studentNumber`),
  KEY `fk_0d2ca5c85fb92d7c665ebb2ee95` (`sectionId`),
  KEY `fk_73ea5217926f1bd13ef9a26e37e` (`teamId`),
  CONSTRAINT `fk_0d2ca5c85fb92d7c665ebb2ee95` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_73ea5217926f1bd13ef9a26e37e` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'Alexander','Custodio','2014-00000','test',1,1,1,1),(2,'Almer','Mendoza','2014-00001','test',0,1,1,1),(3,'Carlos Miguel','Canonizado','2014-00002','test',0,1,1,2),(4,'Cedric','Gaza','2014-00003','test',0,1,1,2),(5,'Charles Jo','Marquez','2014-00004','test',1,0,1,NULL),(6,'Christian','Camma','2014-00005','test',1,0,1,NULL),(7,'Ciara Mae','Gotis','2014-00006','test',1,0,1,NULL),(8,'Claizel Coubeili','Cepe','2014-00007','test',1,0,1,NULL),(9,'David','Benavidez','2014-00008','test',1,0,1,NULL),(10,'Elisha','Luzano','2014-00009','test',1,0,1,NULL),(11,'Emy Jane','Cabarles','2014-00010','test',1,0,1,NULL),(12,'Erika Louise','Nepomuceno','2014-00011','test',1,0,1,NULL),(13,'Erlen Mae','Evangelista','2014-00012','test',1,0,1,NULL),(14,'Harold','Roxas','2014-00013','test',1,0,1,NULL),(15,'Hasper','Sunga','2014-00014','test',1,1,2,3),(16,'Jake','Tagnepis','2014-00015','test',0,1,2,3),(17,'Jarvin Leinardo','Tablang','2014-00016','test',0,1,2,4),(18,'Jefferson','Basilio','2014-00017','test',1,1,2,4),(19,'Jeriel','Jaro','2014-00018','test',1,0,2,NULL),(20,'Jonah','Catindig','2014-00019','test',1,0,2,NULL),(21,'Jourish','Abasolo','2014-00020','test',1,0,2,NULL),(22,'Keith Liam','Manaloto','2014-00021','test',1,0,2,NULL),(23,'Kenneth','Mojar','2014-00022','test',1,0,2,NULL),(24,'Kia Mei','Somabes','2014-00023','test',1,0,2,NULL),(25,'Kobe Jee','de Luna','2014-00024','test',1,0,2,NULL),(26,'Leah','Sison','2014-00025','test',1,0,2,NULL),(27,'Loraine','Racasa','2014-00026','test',1,0,2,NULL),(28,'Lorenz Matthew','Afable','2014-00027','test',1,0,2,NULL),(29,'Louie','Pastores','2014-00028','test',1,0,3,NULL),(30,'Lyka','Macaraig','2014-00029','test',1,0,3,NULL),(31,'Lyka','Macusi','2014-00030','test',1,0,3,NULL),(32,'Magi Joy','Larin','2014-00031','test',1,0,3,NULL),(33,'Manuel Joseph','Urbano','2014-00032','test',1,0,3,NULL),(34,'Marianne Louise','Rivera','2014-00033','test',1,0,3,NULL),(35,'Maze','Fernandez','2014-00034','test',1,0,3,NULL),(36,'Mon Cedrick','Frias','2014-00035','test',1,0,3,NULL),(37,'Naomi Joy','Sibal','2014-00036','test',1,0,3,NULL),(38,'PA','Ganayo','2014-00037','test',1,0,3,NULL),(39,'Peter Bernarnd','Rupa','2014-00038','test',1,1,3,NULL),(40,'Ralph Lawrence','Silaya','2014-00039','test',1,1,3,NULL),(41,'Robert','Cosuco','2014-00040','test',1,1,3,NULL),(42,'Samuel Tadeo','Bautista','2014-00041','test',1,1,3,NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sectionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_af0c1dab481905b8fea834580c9` (`sectionId`),
  CONSTRAINT `fk_af0c1dab481905b8fea834580c9` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (1,1),(2,1),(3,2),(4,2);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-16  2:27:05
