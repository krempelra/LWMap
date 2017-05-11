
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


--
-- Table structure for table `CheckURI`
--

CREATE TABLE `CheckURI` (
  `id` bigint(20) NOT NULL,
  `Timestamp` bigint(20) NOT NULL,
  `User` varchar(255) COLLATE utf8_bin NOT NULL,
  `Search` varchar(255) COLLATE utf8_bin NOT NULL,
  `URI` varchar(255) COLLATE utf8_bin NOT NULL,
  `Success` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `ClickVisualisation`
--

CREATE TABLE `ClickVisualisation` (
  `id` bigint(20) NOT NULL,
  `Timestamp` bigint(20) NOT NULL COMMENT 'The Time the Node was Clicked',
  `VisHash` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'This is the Hash of the Visualisation that the Click happend in',
  `User` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'The User That Clicked',
  `URI` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'The URI of the Node that is Clicked on',
  `FocusOpen` tinyint(4) NOT NULL COMMENT 'This field has a 0 if an URI is Focused and 1 id the Node is Opend'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `Create`
--

CREATE TABLE `Create` (
  `id` bigint(20) NOT NULL,
  `Timestamp` bigint(20) NOT NULL,
  `VisHash` varchar(255) COLLATE utf8_bin NOT NULL,
  `URI1` varchar(255) COLLATE utf8_bin NOT NULL,
  `URI2` varchar(255) COLLATE utf8_bin NOT NULL,
  `URI3` varchar(255) COLLATE utf8_bin NOT NULL,
  `URI4` varchar(255) COLLATE utf8_bin NOT NULL,
  `URI5` varchar(255) COLLATE utf8_bin NOT NULL,
  `lang` varchar(30) COLLATE utf8_bin NOT NULL COMMENT 'Language',
  `User` varchar(255) COLLATE utf8_bin NOT NULL,
  `New` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bares the Information About Inserted Stuff to create a Visualisation';

-- --------------------------------------------------------

--
-- Table structure for table `CreateFinished`
--

CREATE TABLE `CreateFinished` (
  `id` bigint(20) NOT NULL,
  `Timestamp` bigint(20) NOT NULL,
  `VisHash` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `FilterFacett`
--

CREATE TABLE `FilterFacett` (
  `id` bigint(20) NOT NULL,
  `Timestamp` bigint(20) NOT NULL COMMENT 'The Time the Node was Clicked',
  `VisHash` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'This is the Hash of the Visualisation that the Click happend in',
  `User` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'The User That Clicked',
  `FilterString` varchar(1024) COLLATE utf8_bin DEFAULT NULL,
  `FilterOptions` varchar(255) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `OpenVisualisation`
--

CREATE TABLE `OpenVisualisation` (
  `id` bigint(20) NOT NULL,
  `Timestamp` bigint(20) NOT NULL,
  `VisHash` varchar(255) COLLATE utf8_bin NOT NULL,
  `User` varchar(255) COLLATE utf8_bin NOT NULL,
  `SharingUser` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `Timestamp` bigint(20) NOT NULL,
  `User` varchar(255) COLLATE utf8_bin NOT NULL,
  `SharingUser` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CheckURI`
--
ALTER TABLE `CheckURI`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ClickVisualisation`
--
ALTER TABLE `ClickVisualisation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Create`
--
ALTER TABLE `Create`
  ADD PRIMARY KEY (`id`),
  ADD KEY `User` (`User`);

--
-- Indexes for table `CreateFinished`
--
ALTER TABLE `CreateFinished`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `FilterFacett`
--
ALTER TABLE `FilterFacett`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `OpenVisualisation`
--
ALTER TABLE `OpenVisualisation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`User`,`SharingUser`),
  ADD UNIQUE KEY `SharingUser` (`SharingUser`),
  ADD UNIQUE KEY `User` (`User`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `CheckURI`
--
ALTER TABLE `CheckURI`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ClickVisualisation`
--
ALTER TABLE `ClickVisualisation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Create`
--
ALTER TABLE `Create`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `CreateFinished`
--
ALTER TABLE `CreateFinished`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `FilterFacett`
--
ALTER TABLE `FilterFacett`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `OpenVisualisation`
--
ALTER TABLE `OpenVisualisation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;COMMIT;