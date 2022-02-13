package com.coupang.fc.domain

import com.coupang.fc.common.ExpectedCaseException
import com.coupang.fc.data.TeamPlayerCreateRequest
import com.coupang.fc.data.TeamPlayerDto
import javax.persistence.*

@Entity
@Table(name = "team_player")
class TeamPlayer(
    @ManyToOne
    @JoinColumn(name = "matchId")
    private var match: Match,
    request: TeamPlayerCreateRequest
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teamPlayerId", nullable = false)
    private var teamPlayerId: Long? = null
    private var playerId: Long = request.playerId
    private var teamA: Boolean = request.teamA
    private var deleted: Boolean = false

    @ManyToOne
    @JoinColumn(name = "playerId", insertable = false, updatable = false)
    private var player: Player? = null

    val playerIdGet get() = playerId
    val teamAGet get() = teamA
    val playerGet get() = player

    fun delete() {
        deleted = true
    }

    fun toDto(): TeamPlayerDto {
        return TeamPlayerDto(
            playerId = this.playerId,
            teamA = this.teamA,
            playerDto = player?.toDto() ?: throw ExpectedCaseException("유효하지 않은 선수입니다."),
        )
    }

}