package com.coupang.fc.data

data class MatchCreateRequest(
    var playerList: List<TeamPlayerCreateRequest>
)

data class TeamPlayerCreateRequest(
    var playerId: Long,
    var teamA: Boolean
)