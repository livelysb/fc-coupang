package com.coupang.fc.domain

import com.coupang.fc.common.ExpectedCaseException
import com.coupang.fc.data.GoalRequest
import com.coupang.fc.data.MatchCreateRequest
import com.coupang.fc.data.MatchDto
import org.hibernate.annotations.Where
import java.time.LocalDate
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "`match`")
@Where(clause = "deleted = 0")
class Match(request: MatchCreateRequest) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private var matchId: Long? = null
    private var matchDate: LocalDate = LocalDate.now()
    private var teamAScore: Int = 0
    private var teamBScore: Int = 0

    @Enumerated(EnumType.STRING)
    private var status: Status = Status.IN_PROGRESS
    private var deleted: Boolean = false

    @Column(insertable = false, updatable = false)
    private var createdAt: LocalDateTime = LocalDateTime.now()

    @Column(insertable = false, updatable = false)
    private var updatedAt: LocalDateTime = LocalDateTime.now()

    @OneToMany(mappedBy = "match", cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    private val teamPlayerList: MutableList<TeamPlayer> =
        request.playerList.map { TeamPlayer(this, it) }.toMutableList()


    @OneToMany(mappedBy = "match", cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    private val goalList: MutableList<Goal> = emptyList<Goal>().toMutableList()

    init {
        val teamAPlayerCnt = teamPlayerList.filter { teamPlayer -> teamPlayer.teamAGet }.size
        if (teamAPlayerCnt == 0 || teamAPlayerCnt == teamPlayerList.size) {
            throw ExpectedCaseException("팀의 선수는 1명 이상이어야 합니다.")
        }
    }

    enum class Status(val description: String) {
        IN_PROGRESS("경기중"), ENDED("경기종료")
    }


    fun end() {
        status = Status.ENDED
        val goalPlayerMap = goalList
            .map { it.toDto() }
            .groupingBy { it.goalPlayerId }
            .eachCount()
        val assistPlayerMap = goalList
            .map { it.toDto() }
            .groupingBy { it.assistPlayerId }
            .eachCount()

        teamPlayerList.forEach { teamPlayer ->
            run {
                val won = if (teamAScore == teamBScore) {
                    null
                } else {
                    (teamPlayer.teamAGet && teamAScore > teamBScore) || (!teamPlayer.teamAGet && teamAScore < teamBScore)
                }
                teamPlayer.playerGet!!.updateMatchResult(
                    won,
                    goalPlayerMap[teamPlayer.playerIdGet] ?: 0,
                    assistPlayerMap[teamPlayer.playerIdGet] ?: 0
                )
            }


        }

    }

    fun saveGoal(request: GoalRequest) {
        if (request.assistPlayerId == request.goalPlayerId) {
            throw ExpectedCaseException("득점 선수와 도움 선수는 같을 수 없습니다.")
        }
        val goalPlayer = teamPlayerList.find { teamPlayer -> teamPlayer.playerIdGet == request.goalPlayerId }
            ?: throw ExpectedCaseException("득점 선수가 유효하지 않습니다.")
        val assistPlayer = teamPlayerList.find { teamPlayer -> teamPlayer.playerIdGet == request.assistPlayerId }
        if (request.assistPlayerId != null && assistPlayer == null) {
            throw ExpectedCaseException("도움 선수가 유효하지 않습니다.")
        }
        if (goalPlayer.teamAGet) {
            teamAScore++
        } else {
            teamBScore++
        }
        goalList.add(Goal(this, request))
    }

    fun delete() {
        deleted = true
        teamPlayerList.forEach { it.delete() }
        goalList.forEach { it.delete() }

    }

    val id get() = matchId

    fun toDto(): MatchDto {
        return MatchDto(
            matchId = matchId!!,
            matchDate = matchDate,
            teamAScore = teamAScore,
            teamBScore = teamBScore,
            status = status,
            deleted = deleted,
            createdAt = createdAt,
            updatedAt = updatedAt,
            teamPlayerDtoList = teamPlayerList.map { it.toDto() },
            goalDtoList = goalList.map { it.toDto() }
        )
    }


}