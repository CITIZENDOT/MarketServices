CREATE TABLE `Users`(
    `userId` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `email` VARCHAR(255) UNIQUE CHECK (`email` RLIKE '^\\S+@\\S+\\.\\S+$') NOT NULL,
    `userRole` VARCHAR(10) CHECK (`userRole` in ('CUSTOMER', 'SHOPKEEPER', 'ADMIN')) NOT NULL,
    `firstName` VARCHAR(30) NOT NULL,
    `lastName` VARCHAR(30),
    `hashedPassword` CHAR(60) NOT NULL
);


CREATE TABLE `Gatepasses`(
    `shopKeeperUserId` INT PRIMARY KEY NOT NULL,
    `endDate` DATE NOT NULL,
    FOREIGN KEY (`shopKeeperUserId`) REFERENCES `Users`(`userId`)
);


CREATE TABLE `Shops`(
    `shopId` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `shopName` VARCHAR(30) NOT NULL,
    `landmark` VARCHAR(100),
    `rentPerMonth` INT NOT NULL
);


CREATE TABLE `Licenses`(
    `licenseId` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `shopKeeperUserId` INT NOT NULL,
    `shopId` INT NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    FOREIGN KEY(`shopKeeperUserId`) REFERENCES `Users`(`userId`),
    FOREIGN KEY(`shopId`) REFERENCES `Shops`(`shopId`)
);


CREATE TABLE `Payments`(
    `licenseId` INT NOT NULL,
    `paymentType` VARCHAR(15) CHECK (`paymentType` IN ('RENT', 'ELECTRICITY')) NOT NULL,
    `amount` INT NOT NULL,
    `penalty` INT NOT NULL,
    `dueDate` DATE NOT NULL,
    `paymentDate` DATE,
    `paymentDateYear` SMALLINT GENERATED ALWAYS AS (YEAR(`paymentDate`)) STORED,
    `paymentDateMonth` SMALLINT GENERATED ALWAYS AS (MONTH(`paymentDate`)) STORED,
    PRIMARY KEY (`licenseId`, `paymentType`, `paymentDateYear`, `paymentDateMonth`),
    FOREIGN KEY(`licenseId`) REFERENCES `Licenses`(`licenseId`)
);


CREATE TABLE `Feedbacks`(
    `licenseId` INT NOT NULL,
    `customerId` INT NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` in (-10, -5, 0, 5, 10)),
    `remarks` VARCHAR(200) NULL,
    PRIMARY KEY (`licenseId`, `customerId`),
    FOREIGN KEY(`licenseId`) REFERENCES `Licenses`(`licenseId`),
    FOREIGN KEY(`customerId`) REFERENCES `Users`(`userId`)
);


-- MySQL Function
-- Name is pretty much self-explanatory, i.e., checks user role.
DELIMITER $$
CREATE FUNCTION checkUserRole (userId INT, userRole VARCHAR(10))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
DECLARE result BOOLEAN DEFAULT 0;
SELECT 1 INTO result FROM `Users` WHERE `userId` = userId AND `userRole` = userRole;
RETURN result;
END $$


-- Gatepass should be issued only for ShopKeepers
CREATE TRIGGER `check_gatepass`
BEFORE INSERT ON `Gatepasses` FOR EACH ROW
BEGIN
IF NOT checkUserRole(NEW.shopKeeperUserId, 'SHOPKEEPER') THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Given user is NOT a ShopKeeper';
END IF;
END $$


-- License Constraints
CREATE TRIGGER `check_license`
BEFORE INSERT ON `Licenses` FOR EACH ROW
BEGIN
IF NOT checkUserRole(NEW.shopKeeperUserId, 'SHOPKEEPER') THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Given user is NOT a ShopKeeper';
END IF;
END $$


-- Feedback Constraints
CREATE TRIGGER `check_feedback`
BEFORE INSERT ON `Feedbacks` FOR EACH ROW
BEGIN
IF NOT checkUserRole(NEW.customerId, 'CUSTOMER') THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Given user is NOT a customer';
END IF;
END $$
DELIMITER ;