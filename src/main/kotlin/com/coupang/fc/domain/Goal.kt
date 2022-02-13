package com.coupang.fc.domain

import com.coupang.fc.data.GoalDto
import com.coupang.fc.data.GoalRequest
import org.hibernate.annotations.Where
import javax.persistence.*

@Entity
@Table(name = "goal")
@Where(clause = "deleted = 0")
class Goal(
    @ManyToOne
    @JoinColumn(name = "matchId")
    private var match: Match, request: GoalRequest) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private var goalId: Long? = null
    private var goalPlayerId: Long = request.goalPlayerId
    private var assistPlayerId: Long? = request.assistPlayerId
    private var deleted: Boolean = false

    fun toDto(): GoalDto =
        GoalDto(
            goalId = goalId!!,
            matchId = match.id!!,
            goalPlayerId = goalPlayerId,
            assistPlayerId = assistPlayerId
        )
    

    fun delete() {
        deleted = true
    }
}