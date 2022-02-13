package com.coupang.fc.data

data class TeamPlayerDto(
    val playerId: Long,
    val teamA: Boolean,
    val playerDto: PlayerDto
)