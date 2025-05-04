-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 01, 2025 at 05:54 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `signup`
--

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `name`, `email`, `password`) VALUES
(3, 'dos ', 'dos@gmail.com', '123'),
(4, 'tres ', 'tres@gmail.com', '123'),
(6, 'p', 'p@gmail.com', '$2b$10$pSCzOf5hZk/iYDO461tb1e/PaL/Gjy63zV1L.HL7iq2oy/P7eP.sm'),
(17, 'pedro ', 'p@gmail.com', '$2b$10$PkrKJJcme46Ie65olavnr.TVPMnuNruxIjY96CLLLmKcEegp.WXHS'),
(18, 'luis', 'l@gmail.com', '$2b$10$2TBOzL4qURJxHYJ6oXaNteWFuBFl4rc0J/KF93Mzn/GksPVDvFgw.'),
(21, 'q', 'q@gmail.com', '12'),
(24, 'uno ', 'uno@gmail.com', '123'),
(28, 'isidro', 'isidro@gmail.com', '1234'),
(29, 'sjsu', 'sjsu@gmail.com', '123'),
(30, 'two ', 'two@gmail.com', '123'),
(31, 'jaime ', 'jaime@gmail.com', '123'),
(32, '12', '12@gmail.com', '123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
