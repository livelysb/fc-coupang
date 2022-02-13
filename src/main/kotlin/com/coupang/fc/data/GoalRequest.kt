package com.coupang.fc.data

data class GoalRequest(
    val matchId: Long,
    val goalPlayerId: Long,
    val assistPlayerId: Long?
)