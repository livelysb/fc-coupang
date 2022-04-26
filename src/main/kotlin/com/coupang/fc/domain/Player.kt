package com.coupang.fc.domain

import com.coupang.fc.data.PlayerCreateRequest
import com.coupang.fc.data.PlayerDto
import org.hibernate.annotations.Where
import java.time.LocalDateTime
import javax.persistence.*
import kotlin.math.round

@Entity
@Table(name = "player")
@Where(clause = "deleted = 0")
class Player(
    request: PlayerCreateRequest
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private var playerId: Long? = null
    private var name: String = request.name
    private var nickname: String = request.nickname
    private var winCnt: Int = 0
    private var loseCnt: Int = 0
    private var goalCnt: Int = 0
    private var assistCnt: Int = 0
    private var matchCnt: Int = 0
    private var deleted: Boolean = false

    @Column(insertable = false, updatable = false)
    private var createdAt: LocalDateTime = LocalDateTime.now()

    @Column(insertable = false, updatable = false)
    private var updatedAt: LocalDateTime = LocalDateTime.now()

    fun updateMatchResult(won: Boolean?, goalCnt: Int, assistCnt: Int) {
        matchCnt++
        if (won == true) {
            winCnt++
        } else if (won == false) {
            loseCnt++
        }
        this.goalCnt += goalCnt
        this.assistCnt += assistCnt
    }

    fun toDto() =
        PlayerDto(
            playerId = playerId!!,
            name = name,
            nickname = nickname,
            winCnt = winCnt,
            loseCnt = loseCnt,
            goalCnt = goalCnt,
            assistCnt = assistCnt,
            matchCnt = matchCnt,
            createdAt = createdAt,
            updatedAt = updatedAt,
            winningPoints = if (matchCnt != 0) {
                round(((winCnt + (matchCnt - winCnt - loseCnt) * 0.5) / matchCnt) * 1000) / 100
            } else 0.00
        )
}