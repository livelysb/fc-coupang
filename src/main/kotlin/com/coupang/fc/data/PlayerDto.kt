package com.coupang.fc.data

import java.time.LocalDateTime

data class PlayerDto(
    val playerId: Long,
    val name: String,
    val nickname: String,
    val winCnt: Int,
    val loseCnt: Int,
    val goalCnt: Int,
    val assistCnt: Int,
    val matchCnt: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,

    val winningPoints: Double
)



