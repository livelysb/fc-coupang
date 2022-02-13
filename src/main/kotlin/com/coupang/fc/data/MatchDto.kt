package com.coupang.fc.data

import com.coupang.fc.domain.Match
import java.time.LocalDate
import java.time.LocalDateTime

data class MatchDto(
    val matchId: Long,
    val matchDate: LocalDate,
    val teamAScore: Int,
    val teamBScore: Int,
    val status: Match.Status,
    val deleted: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val teamPlayerDtoList: List<TeamPlayerDto>,
    val goalDtoList: List<GoalDto>
)