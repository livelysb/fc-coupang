package com.coupang.fc.data

data class GoalDto(
    val goalId: Long,
    val matchId: Long,
    val goalPlayerId: Long,
    val assistPlayerId: Long?,
)