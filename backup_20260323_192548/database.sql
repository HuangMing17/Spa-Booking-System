-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: exercise201
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `exercise201`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `exercise201` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `exercise201`;

--
-- Table structure for table `attribute_values`
--

DROP TABLE IF EXISTS `attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute_values` (
  `id` binary(16) NOT NULL,
  `attribute_value` varchar(255) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `attribute_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkaq0fvnivyrmqu857uy04xgmm` (`attribute_id`),
  CONSTRAINT `FKkaq0fvnivyrmqu857uy04xgmm` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_values`
--

LOCK TABLES `attribute_values` WRITE;
/*!40000 ALTER TABLE `attribute_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attributes` (
  `id` binary(16) NOT NULL,
  `attribute_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkagsu8uri85emo6x7lxpsvs9p` (`created_by`),
  KEY `FKtgiw6t3448ahf7moes0v5jgsk` (`updated_by`),
  CONSTRAINT `FKkagsu8uri85emo6x7lxpsvs9p` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKtgiw6t3448ahf7moes0v5jgsk` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item_attributes`
--

DROP TABLE IF EXISTS `cart_item_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item_attributes` (
  `cart_item_id` binary(16) NOT NULL,
  `attribute_value_id` binary(16) DEFAULT NULL,
  KEY `FKh3gmrmbtay8kh6x1r76a36v35` (`cart_item_id`),
  CONSTRAINT `FKh3gmrmbtay8kh6x1r76a36v35` FOREIGN KEY (`cart_item_id`) REFERENCES `cart_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item_attributes`
--

LOCK TABLES `cart_item_attributes` WRITE;
/*!40000 ALTER TABLE `cart_item_attributes` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item_variants`
--

DROP TABLE IF EXISTS `cart_item_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item_variants` (
  `cart_item_id` binary(16) NOT NULL,
  `variant_value_id` binary(16) DEFAULT NULL,
  KEY `FKldbdgrt2jtcdj6pblv4bkc5kk` (`cart_item_id`),
  CONSTRAINT `FKldbdgrt2jtcdj6pblv4bkc5kk` FOREIGN KEY (`cart_item_id`) REFERENCES `cart_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item_variants`
--

LOCK TABLES `cart_item_variants` WRITE;
/*!40000 ALTER TABLE `cart_item_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` binary(16) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `appointment_date` datetime(6) DEFAULT NULL,
  `discount` double NOT NULL,
  `duration` int DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL,
  `product_id` binary(16) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` double NOT NULL,
  `total` double NOT NULL,
  `unit_price` double NOT NULL,
  `cart_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` binary(16) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `appointment_date` datetime(6) DEFAULT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `coupon_discount` double DEFAULT NULL,
  `customer_id` binary(16) NOT NULL,
  `discount` double NOT NULL,
  `note` varchar(1000) DEFAULT NULL,
  `subtotal` double NOT NULL,
  `tax` double NOT NULL,
  `total` double NOT NULL,
  `total_items` int NOT NULL,
  `total_quantity` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` binary(16) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `category_description` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `parent_id` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_41g4n0emuvcm3qyf1f6cn43c0` (`category_name`),
  KEY `FKq8tdmuivklnln9qfhbd5t4h2i` (`created_by`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  KEY `FK575exl9wfoqsbed5al2srh6jn` (`updated_by`),
  CONSTRAINT `FK575exl9wfoqsbed5al2srh6jn` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKq8tdmuivklnln9qfhbd5t4h2i` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_conversations`
--

DROP TABLE IF EXISTS `chat_conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_conversations` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `customer_id` binary(16) NOT NULL COMMENT 'ID c?a kh?ch h?ng',
  `assigned_staff_id` binary(16) DEFAULT NULL COMMENT 'ID c?a staff ???c assign',
  `status` enum('ACTIVE','CLOSED','WAITING') COLLATE utf8mb4_unicode_ci DEFAULT 'WAITING' COMMENT 'Tr?ng th?i conversation',
  `last_message_at` timestamp NULL DEFAULT NULL COMMENT 'Th?i gian tin nh?n cu?i',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL COMMENT 'Th?i gian ??ng conversation',
  `closed_by` binary(16) DEFAULT NULL COMMENT 'Staff ??ng conversation',
  `room_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_conversation_closed_by` (`closed_by`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_staff_id` (`assigned_staff_id`),
  KEY `idx_status` (`status`),
  KEY `idx_last_message` (`last_message_at` DESC),
  KEY `idx_created_at` (`created_at` DESC),
  KEY `idx_conv_status_updated` (`status`,`updated_at` DESC),
  KEY `idx_conv_staff_status` (`assigned_staff_id`,`status`),
  CONSTRAINT `fk_conversation_closed_by` FOREIGN KEY (`closed_by`) REFERENCES `staff_accounts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_conversation_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_conversation_staff` FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff_accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='B?ng l?u tr? c?c cu?c h?i tho?i chat';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_conversations`
--

LOCK TABLES `chat_conversations` WRITE;
/*!40000 ALTER TABLE `chat_conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `conversation_id` binary(16) NOT NULL COMMENT 'ID conversation',
  `sender_type` enum('CUSTOMER','STAFF') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Lo?i ng??i g?i',
  `sender_id` binary(16) NOT NULL COMMENT 'ID ng??i g?i',
  `message_type` enum('TEXT','IMAGE','FILE','SYSTEM') COLLATE utf8mb4_unicode_ci DEFAULT 'TEXT' COMMENT 'Lo?i tin nh?n',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'N?i dung tin nh?n',
  `attachment_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL file ??nh k?m',
  `attachment_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'T?n file ??nh k?m',
  `attachment_size` bigint DEFAULT NULL COMMENT 'K?ch th??c file (bytes)',
  `attachment_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'MIME type c?a file',
  `is_read` tinyint(1) DEFAULT '0' COMMENT '?? ??c ch?a',
  `read_at` timestamp NULL DEFAULT NULL COMMENT 'Th?i gian ??c',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `edited_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `sender_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_conversation_id` (`conversation_id`),
  KEY `idx_created_at` (`created_at` DESC),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_sender` (`sender_type`,`sender_id`),
  KEY `idx_conversation_created` (`conversation_id`,`created_at` DESC),
  KEY `idx_msg_conv_unread` (`conversation_id`,`is_read`,`created_at` DESC),
  FULLTEXT KEY `idx_content` (`content`),
  CONSTRAINT `fk_message_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='B?ng l?u tr? tin nh?n chat';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_update_last_message_at` AFTER INSERT ON `chat_messages` FOR EACH ROW BEGIN
    UPDATE chat_conversations
    SET last_message_at = NEW.created_at,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversation_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_update_unread_count` AFTER INSERT ON `chat_messages` FOR EACH ROW BEGIN
    
    IF NEW.sender_type = 'CUSTOMER' THEN
        UPDATE chat_participants
        SET unread_count = unread_count + 1
        WHERE conversation_id = NEW.conversation_id
          AND participant_type = 'STAFF'
          AND is_active = TRUE;
    ELSE
        UPDATE chat_participants
        SET unread_count = unread_count + 1
        WHERE conversation_id = NEW.conversation_id
          AND participant_type = 'CUSTOMER'
          AND is_active = TRUE;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `chat_participants`
--

DROP TABLE IF EXISTS `chat_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_participants` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `conversation_id` binary(16) NOT NULL COMMENT 'ID conversation',
  `participant_type` enum('CUSTOMER','STAFF') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Lo?i ng??i tham gia',
  `participant_id` binary(16) NOT NULL COMMENT 'ID ng??i tham gia',
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Th?i gian tham gia',
  `last_seen_at` timestamp NULL DEFAULT NULL COMMENT 'L?n cu?i xem',
  `unread_count` int DEFAULT '0' COMMENT 'S? tin nh?n ch?a ??c',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'C?n active kh?ng',
  `left_at` timestamp NULL DEFAULT NULL COMMENT 'Th?i gian r?i kh?i',
  `participant_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_conversation_participant` (`conversation_id`,`participant_type`,`participant_id`),
  KEY `idx_participant` (`participant_type`,`participant_id`),
  KEY `idx_unread` (`unread_count`),
  KEY `idx_last_seen` (`last_seen_at` DESC),
  CONSTRAINT `fk_participant_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='B?ng l?u th?ng tin ng??i tham gia conversation';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_participants`
--

LOCK TABLES `chat_participants` WRITE;
/*!40000 ALTER TABLE `chat_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_quick_replies`
--

DROP TABLE IF EXISTS `chat_quick_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_quick_replies` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ti?u ??',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'N?i dung c?u tr? l?i',
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Danh m?c (greeting, closing, etc)',
  `usage_count` int DEFAULT '0' COMMENT 'S? l?n s? d?ng',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'C?n active kh?ng',
  `created_by` binary(16) DEFAULT NULL COMMENT 'Staff t?o',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_quick_reply_creator` (`created_by`),
  KEY `idx_category` (`category`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_usage_count` (`usage_count` DESC),
  FULLTEXT KEY `idx_title_content` (`title`,`content`),
  CONSTRAINT `fk_quick_reply_creator` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='B?ng l?u c?u tr? l?i nhanh cho staff';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_quick_replies`
--

LOCK TABLES `chat_quick_replies` WRITE;
/*!40000 ALTER TABLE `chat_quick_replies` DISABLE KEYS */;
INSERT INTO `chat_quick_replies` VALUES (_binary '›É\\K\Œ\Ò†ôÕ¶\€ê','Ch?o m?ng','Xin ch?o! T?i c? th? gi?p g? cho b?n?','greeting',0,1,NULL,'2026-03-12 04:49:34','2026-03-12 04:49:34'),(_binary '›É~w\Œ\Ò†ôÕ¶\€ê','C?m ?n','C?m ?n b?n ?? li?n h?. Ch?c b?n m?t ng?y t?t l?nh!','closing',0,1,NULL,'2026-03-12 04:49:34','2026-03-12 04:49:34'),(_binary '›ÉÅÖ\Œ\Ò†ôÕ¶\€ê','Ch? m?t ch?t','Vui l?ng ch? m?t ch?t, t?i s? ki?m tra th?ng tin cho b?n.','common',0,1,NULL,'2026-03-12 04:49:34','2026-03-12 04:49:34'),(_binary '›ÉÇ}\Œ\Ò†ôÕ¶\€ê','Gi? l?m vi?c','Spa ch?ng t?i m? c?a t? 8:00 - 22:00 h?ng ng?y.','info',0,1,NULL,'2026-03-12 04:49:34','2026-03-12 04:49:34'),(_binary '›ÉÉ\r\Œ\Ò†ôÕ¶\€ê','Li?n h?','B?n c? th? li?n h? qua s? hotline: 1900-xxxx ho?c email: support@spa-bonlai.com','info',0,1,NULL,'2026-03-12 04:49:34','2026-03-12 04:49:34');
/*!40000 ALTER TABLE `chat_quick_replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_typing_indicators`
--

DROP TABLE IF EXISTS `chat_typing_indicators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_typing_indicators` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `conversation_id` binary(16) NOT NULL COMMENT 'ID conversation',
  `user_type` enum('CUSTOMER','STAFF') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Lo?i user',
  `user_id` binary(16) NOT NULL COMMENT 'ID user',
  `is_typing` tinyint(1) DEFAULT '0' COMMENT '?ang g? hay kh?ng',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_conversation_user` (`conversation_id`,`user_type`,`user_id`),
  KEY `idx_updated_at` (`updated_at`),
  KEY `idx_is_typing` (`is_typing`),
  CONSTRAINT `fk_typing_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='B?ng l?u tr?ng th?i ?ang g?';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_typing_indicators`
--

LOCK TABLES `chat_typing_indicators` WRITE;
/*!40000 ALTER TABLE `chat_typing_indicators` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_typing_indicators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int NOT NULL,
  `iso` varchar(2) NOT NULL,
  `iso3` varchar(3) DEFAULT NULL,
  `name` varchar(80) NOT NULL,
  `num_code` smallint DEFAULT NULL,
  `phone_code` int NOT NULL,
  `upper_name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries_seq`
--

DROP TABLE IF EXISTS `countries_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries_seq`
--

LOCK TABLES `countries_seq` WRITE;
/*!40000 ALTER TABLE `countries_seq` DISABLE KEYS */;
INSERT INTO `countries_seq` VALUES (1);
/*!40000 ALTER TABLE `countries_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` binary(16) NOT NULL,
  `code` varchar(50) NOT NULL,
  `coupon_end_date` datetime(6) DEFAULT NULL,
  `coupon_start_date` datetime(6) DEFAULT NULL,
  `discount_type` varchar(50) NOT NULL,
  `discount_value` decimal(38,2) NOT NULL,
  `max_usage` decimal(38,2) DEFAULT NULL,
  `order_amount_limit` decimal(38,2) DEFAULT NULL,
  `times_used` decimal(38,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_eplt0kkm9yf2of2lnx6c1oy9b` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_addresses`
--

DROP TABLE IF EXISTS `customer_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_addresses` (
  `id` binary(16) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `dial_code` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `customer_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrvr6wl9gll7u98cda18smugp4` (`customer_id`),
  CONSTRAINT `FKrvr6wl9gll7u98cda18smugp4` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_addresses`
--

LOCK TABLES `customer_addresses` WRITE;
/*!40000 ALTER TABLE `customer_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` binary(16) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `auth_provider` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firebase_uid` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `registered_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_rfbvkrffamfql7cjmen8v976v` (`email`),
  UNIQUE KEY `UK_ear2fekgai78b2eh3rqew7i4d` (`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (_binary '6°_\ÚˇM˚ë\‰Eoít∑\÷',_binary '','LOCAL','abc@gmail.com',NULL,'dsfs','dsfs','$2a$10$2eydB3hWtYbXp/Q.IoJId.7EPrH80DV8HJ58pwc.m1zawgL6Gx1Zy','0234324432','2026-03-21 02:20:04.696000','2026-03-21 02:20:04.696000','abc@gmail.com');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` binary(16) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_thumbnail` bit(1) DEFAULT NULL,
  `placeholder` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `product_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiygpxsm5v7pxfbn4hmrk6skhd` (`product_id`),
  CONSTRAINT `FKiygpxsm5v7pxfbn4hmrk6skhd` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` binary(16) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `notification_expiry_date` date DEFAULT NULL,
  `receive_time` datetime(6) DEFAULT NULL,
  `seen` bit(1) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `account_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5dsqjxt1wpoa8icawskqijsec` (`account_id`),
  CONSTRAINT `FK5dsqjxt1wpoa8icawskqijsec` FOREIGN KEY (`account_id`) REFERENCES `staff_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` binary(16) NOT NULL,
  `duration` int DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `variant_id` binary(16) DEFAULT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `product_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_statuses`
--

DROP TABLE IF EXISTS `order_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_statuses` (
  `id` binary(16) NOT NULL,
  `color` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `privacy` varchar(10) DEFAULT NULL,
  `status_name` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe4b4y3muy8mopmamipe97nt5j` (`created_by`),
  KEY `FKcg14f8n04d5xkfkpgnglots4n` (`updated_by`),
  CONSTRAINT `FKcg14f8n04d5xkfkpgnglots4n` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKe4b4y3muy8mopmamipe97nt5j` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_statuses`
--

LOCK TABLES `order_statuses` WRITE;
/*!40000 ALTER TABLE `order_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `appointment_date` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `order_approved_at` datetime(6) DEFAULT NULL,
  `total_price` decimal(38,2) NOT NULL,
  `coupon_id` binary(16) DEFAULT NULL,
  `customer_id` binary(16) DEFAULT NULL,
  `order_status_id` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKn1d1gkxckw648m2n2d5gx0yx5` (`coupon_id`),
  KEY `FKpxtb8awmi0dk6smoh2vp1litg` (`customer_id`),
  KEY `FKcbbqf26brulgfgvd0mf74rv4y` (`order_status_id`),
  KEY `FKgclp4rs5m20onj4kjrs0kesx6` (`updated_by`),
  CONSTRAINT `FKcbbqf26brulgfgvd0mf74rv4y` FOREIGN KEY (`order_status_id`) REFERENCES `order_statuses` (`id`),
  CONSTRAINT `FKgclp4rs5m20onj4kjrs0kesx6` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKn1d1gkxckw648m2n2d5gx0yx5` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`),
  CONSTRAINT `FKpxtb8awmi0dk6smoh2vp1litg` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attribute_values`
--

DROP TABLE IF EXISTS `product_attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attribute_values` (
  `id` binary(16) NOT NULL,
  `attribute_value_id` binary(16) NOT NULL,
  `product_attribute_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcq2cdqxc2xn8a8ijv4ess9ifk` (`attribute_value_id`),
  KEY `FKtcpenh8197oeo6a75jtbikim0` (`product_attribute_id`),
  CONSTRAINT `FKcq2cdqxc2xn8a8ijv4ess9ifk` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`),
  CONSTRAINT `FKtcpenh8197oeo6a75jtbikim0` FOREIGN KEY (`product_attribute_id`) REFERENCES `product_attributes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attribute_values`
--

LOCK TABLES `product_attribute_values` WRITE;
/*!40000 ALTER TABLE `product_attribute_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attributes`
--

DROP TABLE IF EXISTS `product_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attributes` (
  `id` binary(16) NOT NULL,
  `attribute_id` binary(16) NOT NULL,
  `product_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6ksuorb5567jpa08ihcumumy1` (`attribute_id`),
  KEY `FKcex46yvx4g18b2pn09p79h1mc` (`product_id`),
  CONSTRAINT `FK6ksuorb5567jpa08ihcumumy1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`),
  CONSTRAINT `FKcex46yvx4g18b2pn09p79h1mc` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attributes`
--

LOCK TABLES `product_attributes` WRITE;
/*!40000 ALTER TABLE `product_attributes` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` binary(16) NOT NULL,
  `category_id` binary(16) NOT NULL,
  `product_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd112rx0alycddsms029iifrih` (`category_id`),
  KEY `FKlda9rad6s180ha3dl1ncsp8n7` (`product_id`),
  CONSTRAINT `FKd112rx0alycddsms029iifrih` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `FKlda9rad6s180ha3dl1ncsp8n7` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_coupons`
--

DROP TABLE IF EXISTS `product_coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_coupons` (
  `id` binary(16) NOT NULL,
  `coupon_id` binary(16) NOT NULL,
  `product_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm8d6v5e6fv8mjg3d0iifq6sw1` (`coupon_id`),
  KEY `FKiaiu1xxcnyw38cbcx4j80psij` (`product_id`),
  CONSTRAINT `FKiaiu1xxcnyw38cbcx4j80psij` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKm8d6v5e6fv8mjg3d0iifq6sw1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_coupons`
--

LOCK TABLES `product_coupons` WRITE;
/*!40000 ALTER TABLE `product_coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` binary(16) NOT NULL,
  `comment` varchar(2000) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `rating` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `customer_id` binary(16) NOT NULL,
  `product_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKicr5gxdiijbvmk7mcn60ls3mb` (`product_id`,`customer_id`),
  KEY `FK23003sau3i9tq86acj378o7u9` (`customer_id`),
  CONSTRAINT `FK23003sau3i9tq86acj378o7u9` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK35kxxqe2g9r4mww80w9e3tnw9` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_shipping_info`
--

DROP TABLE IF EXISTS `product_shipping_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_shipping_info` (
  `id` binary(16) NOT NULL,
  `dimension_depth` decimal(38,2) NOT NULL,
  `dimension_height` decimal(38,2) NOT NULL,
  `dimension_unit` varchar(10) DEFAULT NULL,
  `dimension_width` decimal(38,2) NOT NULL,
  `volume` decimal(38,2) NOT NULL,
  `volume_unit` varchar(10) DEFAULT NULL,
  `weight` decimal(38,2) NOT NULL,
  `weight_unit` varchar(10) DEFAULT NULL,
  `product_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2661qi678nh0prih01pbo2or0` (`product_id`),
  CONSTRAINT `FK2661qi678nh0prih01pbo2or0` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_shipping_info`
--

LOCK TABLES `product_shipping_info` WRITE;
/*!40000 ALTER TABLE `product_shipping_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_shipping_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_suppliers`
--

DROP TABLE IF EXISTS `product_suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_suppliers` (
  `product_id` binary(16) NOT NULL,
  `supplier_id` binary(16) NOT NULL,
  PRIMARY KEY (`product_id`,`supplier_id`),
  KEY `FKmymnd7phgm081dt3iv276yl8a` (`supplier_id`),
  CONSTRAINT `FKj4tjiwcxs97lybw5vac1sjlbp` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKmymnd7phgm081dt3iv276yl8a` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_suppliers`
--

LOCK TABLES `product_suppliers` WRITE;
/*!40000 ALTER TABLE `product_suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tags`
--

DROP TABLE IF EXISTS `product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tags` (
  `product_id` binary(16) NOT NULL,
  `tag_id` binary(16) NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`),
  KEY `FKpur2885qb9ae6fiquu77tcv1o` (`tag_id`),
  CONSTRAINT `FK5rk6s19k3risy7q7wqdr41uss` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKpur2885qb9ae6fiquu77tcv1o` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tags`
--

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` binary(16) NOT NULL,
  `buying_price` decimal(38,2) DEFAULT NULL,
  `compare_price` decimal(38,2) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `disable_out_of_stock` bit(1) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `product_description` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_type` varchar(64) DEFAULT NULL,
  `published` bit(1) DEFAULT NULL,
  `quantity` int NOT NULL,
  `sale_price` decimal(38,2) NOT NULL,
  `short_description` varchar(165) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ostq1ec3toafnjok09y9l7dox` (`slug`),
  KEY `FKih40jfhwkc7lk0fhwlle8ev87` (`created_by`),
  KEY `FK4smi13wyfknqmqchj8ivr6wxb` (`updated_by`),
  CONSTRAINT `FK4smi13wyfknqmqchj8ivr6wxb` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKih40jfhwkc7lk0fhwlle8ev87` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` binary(16) NOT NULL,
  `privileges` varchar(255) DEFAULT NULL,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0','ALL','ROLE_ADMIN'),(_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0','LIMITED','ROLE_STAFF'),(_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0','BASIC','ROLE_CUSTOMER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sells`
--

DROP TABLE IF EXISTS `sells`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sells` (
  `id` binary(16) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `product_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_n3pv02pjmqlha1fqquvc2dxk3` (`product_id`),
  CONSTRAINT `FK4u17xl8ugefnahmg6xa23du0b` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sells`
--

LOCK TABLES `sells` WRITE;
/*!40000 ALTER TABLE `sells` DISABLE KEYS */;
/*!40000 ALTER TABLE `sells` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_rates`
--

DROP TABLE IF EXISTS `shipping_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_rates` (
  `id` binary(16) NOT NULL,
  `max_value` decimal(38,2) DEFAULT NULL,
  `min_value` decimal(38,2) NOT NULL,
  `no_max` bit(1) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `weight_unit` varchar(10) DEFAULT NULL,
  `shipping_zone_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgh1qqt17uy7boc8f8dgyaenal` (`shipping_zone_id`),
  CONSTRAINT `FKgh1qqt17uy7boc8f8dgyaenal` FOREIGN KEY (`shipping_zone_id`) REFERENCES `shipping_zones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_rates`
--

LOCK TABLES `shipping_rates` WRITE;
/*!40000 ALTER TABLE `shipping_rates` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_zones`
--

DROP TABLE IF EXISTS `shipping_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_zones` (
  `id` binary(16) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `free_shipping` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `rate_type` varchar(64) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsryt5m2wxlmvqomukka58bakt` (`created_by`),
  KEY `FKj9e73dbvm96clp0qrubh90sj1` (`updated_by`),
  CONSTRAINT `FKj9e73dbvm96clp0qrubh90sj1` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKsryt5m2wxlmvqomukka58bakt` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_zones`
--

LOCK TABLES `shipping_zones` WRITE;
/*!40000 ALTER TABLE `shipping_zones` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slideshows`
--

DROP TABLE IF EXISTS `slideshows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slideshows` (
  `id` binary(16) NOT NULL,
  `btn_label` varchar(50) DEFAULT NULL,
  `clicks` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(160) DEFAULT NULL,
  `destination_url` varchar(255) DEFAULT NULL,
  `display_order` int NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `placeholder` varchar(255) NOT NULL,
  `published` bit(1) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `styles` json DEFAULT NULL,
  `title` varchar(80) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm4f4t2ur1uu0e24jklw6b7c9j` (`created_by`),
  KEY `FKklo16kmuxbd5jsvv7e4r21p81` (`updated_by`),
  CONSTRAINT `FKklo16kmuxbd5jsvv7e4r21p81` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKm4f4t2ur1uu0e24jklw6b7c9j` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slideshows`
--

LOCK TABLES `slideshows` WRITE;
/*!40000 ALTER TABLE `slideshows` DISABLE KEYS */;
/*!40000 ALTER TABLE `slideshows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_accounts`
--

DROP TABLE IF EXISTS `staff_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_accounts` (
  `id` binary(16) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `role_id` binary(16) NOT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2w05mq0lpmivr2519iuiowve3` (`created_by`),
  KEY `FKicmmixb56mmd16stkenpifr2q` (`role_id`),
  KEY `FK8kt1rbp9uqo3us42qekqu2bwx` (`updated_by`),
  CONSTRAINT `FK2w05mq0lpmivr2519iuiowve3` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FK8kt1rbp9uqo3us42qekqu2bwx` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKicmmixb56mmd16stkenpifr2q` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_accounts`
--

LOCK TABLES `staff_accounts` WRITE;
/*!40000 ALTER TABLE `staff_accounts` DISABLE KEYS */;
INSERT INTO `staff_accounts` VALUES (_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0','2026-03-08 04:38:10.000000','2026-03-08 04:38:10.000000',1,'admin@spa-bonlai.com','Admin',NULL,'User','$2a$10$n.vMA/11oct8jn20eSk0uOokv.evAftIoQ73tcL928aT4NGawbYSW',NULL,NULL,'admin',NULL,_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0',NULL);
/*!40000 ALTER TABLE `staff_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` binary(16) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `country_id` int NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjcuohexsi23vnpxi0t25kvwg7` (`country_id`),
  KEY `FKfiw13lay8hy782gbnxojca2b8` (`created_by`),
  KEY `FKf018rv4htmcbcn4wjrpymxbme` (`updated_by`),
  CONSTRAINT `FKf018rv4htmcbcn4wjrpymxbme` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKfiw13lay8hy782gbnxojca2b8` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKjcuohexsi23vnpxi0t25kvwg7` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` binary(16) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `tag_name` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` binary(16) DEFAULT NULL,
  `updated_by` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj4ujfjyqtl6j6ltrh16llax9a` (`created_by`),
  KEY `FKbfktnbyp9l27sc3ys66hc92hc` (`updated_by`),
  CONSTRAINT `FKbfktnbyp9l27sc3ys66hc92hc` FOREIGN KEY (`updated_by`) REFERENCES `staff_accounts` (`id`),
  CONSTRAINT `FKj4ujfjyqtl6j6ltrh16llax9a` FOREIGN KEY (`created_by`) REFERENCES `staff_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_options`
--

DROP TABLE IF EXISTS `variant_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_options` (
  `id` binary(16) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `buying_price` decimal(38,2) DEFAULT NULL,
  `compare_price` decimal(38,2) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `sale_price` decimal(38,2) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `image_id` binary(16) DEFAULT NULL,
  `product_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3p4s1c0mpm2yibbvgamrkism8` (`image_id`),
  KEY `FKp80xsi8rl51rtft29wsia24hq` (`product_id`),
  CONSTRAINT `FK3p4s1c0mpm2yibbvgamrkism8` FOREIGN KEY (`image_id`) REFERENCES `gallery` (`id`),
  CONSTRAINT `FKp80xsi8rl51rtft29wsia24hq` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_options`
--

LOCK TABLES `variant_options` WRITE;
/*!40000 ALTER TABLE `variant_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `variant_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_values`
--

DROP TABLE IF EXISTS `variant_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_values` (
  `id` binary(16) NOT NULL,
  `product_attribute_value_id` binary(16) NOT NULL,
  `variant_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7ypqk6dc1kdhdcwphasb0q360` (`product_attribute_value_id`),
  KEY `FKqhr8f6gw7fykcrd2ijd80o5te` (`variant_id`),
  CONSTRAINT `FK7ypqk6dc1kdhdcwphasb0q360` FOREIGN KEY (`product_attribute_value_id`) REFERENCES `product_attribute_values` (`id`),
  CONSTRAINT `FKqhr8f6gw7fykcrd2ijd80o5te` FOREIGN KEY (`variant_id`) REFERENCES `variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_values`
--

LOCK TABLES `variant_values` WRITE;
/*!40000 ALTER TABLE `variant_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `variant_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variants`
--

DROP TABLE IF EXISTS `variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variants` (
  `id` binary(16) NOT NULL,
  `variant_option` varchar(255) NOT NULL,
  `product_id` binary(16) NOT NULL,
  `variant_option_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK95bued017vcya4rf4s7n31ew4` (`product_id`),
  KEY `FKkbk89y0ekurxw90mx7jt3hx3q` (`variant_option_id`),
  CONSTRAINT `FK95bued017vcya4rf4s7n31ew4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKkbk89y0ekurxw90mx7jt3hx3q` FOREIGN KEY (`variant_option_id`) REFERENCES `variant_options` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variants`
--

LOCK TABLES `variants` WRITE;
/*!40000 ALTER TABLE `variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'exercise201'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23 12:25:48
