DROP TABLE IF EXISTS `fc_coupang`.`player`;
CREATE TABLE `fc_coupang`.`player`
(
    `playerId`  BIGINT NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(30) NOT NULL,
    `nickname`  VARCHAR(30) NOT NULL,
    `winCnt`    INT         NOT NULL DEFAULT 0,
    `loseCnt`   INT         NOT NULL DEFAULT 0,
    `goalCnt`   INT         NOT NULL DEFAULT 0,
    `assistCnt` INT         NOT NULL DEFAULT 0,
    `matchCnt`  INT         NOT NULL DEFAULT 0,
    `deleted`   TINYINT(1) NOT NULL DEFAULT FALSE,
    `createdAt` DATETIME(6) DEFAULT CURRENT_TIMESTAMP (6),
    `updatedAt` DATETIME(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    PRIMARY KEY (`playerId`)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE `fc_coupang`.`team_player`;
CREATE TABLE `fc_coupang`.`team_player`
(
    `teamPlayerId` BIGINT NOT NULL AUTO_INCREMENT,
    `matchId`      BIGINT NOT NULL,
    `playerId`     BIGINT NOT NULL,
    `teamA`        TINYINT(1) NOT NULL,
    `deleted`      TINYINT(1) NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`teamPlayerId`)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE `fc_coupang`.`match`;
CREATE TABLE `fc_coupang`.`match`
(
    `matchId`    BIGINT NOT NULL AUTO_INCREMENT,
    `matchDate`  DATE        NOT NULL,
    `teamAScore` INT         NOT NULL,
    `teamBScore` INT         NOT NULL,
    `status`     VARCHAR(30) NOT NULL,
    `deleted`    TINYINT(1) NOT NULL DEFAULT FALSE,
    `createdAt`  DATETIME(6) DEFAULT CURRENT_TIMESTAMP (6),
    `updatedAt`  DATETIME(6) DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
    PRIMARY KEY (`matchId`)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE `fc_coupang`.`goal`;
CREATE TABLE `fc_coupang`.`goal`
(
    `goalId`         BIGINT NOT NULL AUTO_INCREMENT,
    `matchId`        BIGINT NOT NULL,
    `goalPlayerId`   BIGINT NOT NULL,
    `assistPlayerId` BIGINT,
    `deleted`        TINYINT(1) NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`goalId`)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;
