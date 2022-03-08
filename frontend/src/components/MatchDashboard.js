import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    Paper,
    Select,
    styled
} from "@mui/material";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import AlertDto from "./global-components/AlertDto";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";
import {useNavigate, useSearchParams} from "react-router-dom";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function MatchDashboard() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [scoreRecord, setScoreRecord] = useState(false)
    const [goalPlayerId, setGoalPlayerId] = useState('')
    const [assistPlayerId, setAssistPlayerId] = useState('')
    const [clickablePlayer, setClickablePlayer] = useState([])
    const [alertDto, setAlertDto] = useState(null);
    const [score, setScore] = useState({teamAScore: 0, teamBScore: 0})
    const [teamA, setTeamA] = useState([])
    const [teamB, setTeamB] = useState([])
    const [goal, setGoal] = useState([])
    const [endMatchDialogOpen, setEndMatchDialogOpen] = useState(false)
    const [cancelMatchDialogOpen, setCancelMatchDialogOpen] = useState(false)


    useEffect(() => {
        getMatch(searchParams.get("matchId"))
    }, []);

    async function getMatch(matchId) {
        await axios
            .get("/api/match?matchId=" + matchId)
            .then((response) => {
                if (response.data.success) {
                    let match = response.data.body;
                    setScore({
                        teamAScore: match.teamAScore,
                        teamBScore: match.teamBScore,
                    })
                    setTeamA(
                        match.teamPlayerDtoList.filter(teamPlayerDto => teamPlayerDto.teamA).map(teamPlayerDto => {
                            return {
                                playerId: teamPlayerDto.playerDto.playerId,
                                name: teamPlayerDto.playerDto.name + " / " + teamPlayerDto.playerDto.nickname
                            }
                        })
                    )
                    setTeamB(
                        match.teamPlayerDtoList.filter(teamPlayerDto => !teamPlayerDto.teamA).map(teamPlayerDto => {
                            return {
                                playerId: teamPlayerDto.playerDto.playerId,
                                name: teamPlayerDto.playerDto.name + " / " + teamPlayerDto.playerDto.nickname
                            }
                        })
                    )
                    setClickablePlayer(
                        match.teamPlayerDtoList.map(teamPlayerDto => {
                            return teamPlayerDto.playerId
                        })
                    )
                    setGoal(
                        match.goalDtoList.map(goalDto => {
                            return {
                                goalPlayerId: goalDto.goalPlayerId,
                                assistPlayerId: goalDto.assistPlayerId
                            }
                        })
                    )
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    function playerClick(e) {
        if (!scoreRecord) {
            setScoreRecord(true)
        }
        if (goalPlayerId === '') {
            goalPlayerOnChange(e)
        } else {
            setAssistPlayerId(parseInt(e.target.value))
        }
    }

    function goalPlayerOnChange(e) {
        let goalPlayerId = parseInt(e.target.value);
        let teamAPlayerId = teamA.map(t => t.playerId);
        setGoalPlayerId(goalPlayerId)
        if (teamAPlayerId.includes(goalPlayerId)) {
            setClickablePlayer(teamAPlayerId)
        } else {
            setClickablePlayer(teamB.map(t => t.playerId))
        }
    }

    async function handleGoalBtn() {
        await axios
            .post("/api/goal", {
                matchId: searchParams.get("matchId"),
                goalPlayerId: goalPlayerId,
                assistPlayerId: assistPlayerId
            })
            .then((response) => {
                if (response.data.success) {
                    if (teamA.findIndex(value => value.playerId === goalPlayerId) >= 0) {
                        score.teamAScore++
                    } else {
                        score.teamBScore++
                    }
                    setGoal((prev => [...prev,
                        {
                            goalPlayerId: goalPlayerId,
                            assistPlayerId: assistPlayerId
                        }
                    ]))
                    setGoalPlayerId('')
                    setAssistPlayerId('')
                    setClickablePlayer(teamA.concat(teamB).map(t => t.playerId))
                    setScoreRecord(false)
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    async function handleEndMatchBtn() {
        await axios
            .post("/api/match/end?matchId=" + searchParams.get("matchId"))
            .then((response) => {
                if (response.data.success) {
                    navigate("/match", {replace: true})
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    async function handleCancelMatchBtn() {
        await axios
            .post( "/api/match/cancel?matchId=" + searchParams.get("matchId"))
            .then((response) => {
                if (response.data.success) {
                    navigate("/match", {replace: true})
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }


    return (
        <Grid sx={{mt: 2, mx: 3, mb: 3}}>
            <h3>경기 기록 <small>- 경기 현황</small></h3>
            <div align={"right"}><h4>경기번호 : {searchParams.get("matchId")}</h4></div>
            <Grid container spacing={2}>
                <Grid xs={6} item justifyContent="center">
                    <Item>
                        <h4>Team A<Box style={{"color":"red"}}>{score.teamAScore}</Box></h4>
                        {
                            teamA ?
                                teamA.map((player) => {
                                    return (
                                        <Box mt={1} px={1} key={player.playerId}>
                                            <Button variant={"outlined"}
                                                    value={player.playerId}
                                                    onClick={playerClick}
                                                    disabled={!clickablePlayer.includes(player.playerId)}
                                                    fullWidth
                                            >{player.name}
                                            </Button>
                                        </Box>
                                    )
                                }) : null
                        }
                    </Item>
                </Grid>
                <Grid xs={6} item justifyContent="center">
                    <Item>
                        <h4>Team B<Box style={{"color":"red"}}>{score.teamBScore}</Box></h4>
                        {
                            teamB ?
                                teamB.map((player) => {
                                    return (
                                        <Box mt={1} px={1} key={player.playerId}>
                                            <Button variant={"outlined"}
                                                    value={player.playerId}
                                                    onClick={playerClick}
                                                    disabled={!clickablePlayer.includes(player.playerId)}
                                                    fullWidth
                                            >{player.name}</Button>
                                        </Box>
                                    )
                                }) : null
                        }
                    </Item>
                </Grid>
            </Grid>
            {
                score.teamAScore + score.teamBScore > 0 ?
                    <Box sx={{mt: 3}}>
                        <h4>득점 기록</h4>
                            <Box sx={{px: 1, py: 1}}>
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>팀</TableCell>
                                                <TableCell>득점 선수</TableCell>
                                                <TableCell>도움 선수</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                goal.map(goalDto => (
                                                        <TableRow key={Math.random()}
                                                                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                            <TableCell component="th" scope="row">
                                                                {teamA.map(t => t.playerId).includes(goalDto.goalPlayerId) ? 'A' : 'B'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {teamA.concat(teamB).find(teamPlayer => goalDto.goalPlayerId === teamPlayer.playerId)?.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {teamA.concat(teamB).find(teamPlayer => goalDto.assistPlayerId === teamPlayer.playerId)?.name}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                    </Box> : null
            }

            {
                scoreRecord ?
                    <Grid mt={2} container justifyContent="center">
                        <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="goal-player-label">득점 선수</InputLabel>

                            <Select
                                labelId="goal-player-label"
                                id="goal-player-select"
                                value={goalPlayerId}
                                onChange={(e) => {
                                    setGoalPlayerId(parseInt(e.target.value))
                                    goalPlayerOnChange(e)
                                }}
                                label="득점 선수">

                                {
                                    clickablePlayer.map((value) => {
                                        let player = teamA.concat(teamB).find(t => value === t.playerId);
                                        return (
                                            <MenuItem key={player.playerId}
                                                      value={player.playerId}>{player.name}</MenuItem>
                                        );
                                    })
                                }
                            </Select>

                        </FormControl>
                        <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="assist-player-label">도움 선수</InputLabel>
                            <Select
                                labelId="assist-player-label"
                                id="assist-player-select"
                                value={assistPlayerId}
                                onChange={(e) => setAssistPlayerId(parseInt(e.target.value))}
                                label="도움 선수">
                                <MenuItem key={0}
                                          value={''}>없음</MenuItem>
                                {
                                    clickablePlayer
                                        .map((value) => {
                                            let player = teamA.concat(teamB).find(t => value === t.playerId);
                                            return (
                                                <MenuItem key={player.playerId}
                                                          value={player.playerId}>{player.name}</MenuItem>
                                            );
                                        })
                                }
                            </Select>
                        </FormControl>
                        <Grid mt={2} container justifyContent="center">
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" type="button" onClick={handleGoalBtn}>저장</Button>
                                <Button variant="contained" type="button" color={"error"}
                                        onClick={() => {
                                            setScoreRecord(false);
                                            setAssistPlayerId('');
                                            setGoalPlayerId('');
                                            setClickablePlayer(teamA.concat(teamB).map(t => t.playerId))
                                        }}
                                >취소</Button>
                            </Stack>
                        </Grid>
                    </Grid> :
                    <Grid mt={2} container justifyContent="flex-end">
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant={"contained"}
                                onClick={() => setScoreRecord(true)}
                                disabled={scoreRecord}>득점</Button>
                            <Button
                                variant={"contained"}
                                color={"success"}
                                onClick={() => setEndMatchDialogOpen(true)}
                                disabled={scoreRecord}>경기 종료</Button>
                            <Button
                                variant={"contained"}
                                color={"error"}
                                onClick={() => setCancelMatchDialogOpen(true)}
                                disabled={scoreRecord}>경기 취소</Button>
                        </Stack>
                    </Grid>
            }
            {
                alertDto ?
                    <CustomizedSnackbar
                        key={alertDto.date}
                        message={alertDto.message}
                        severity={alertDto.severity}
                    /> : null
            }
            <Dialog
                open={endMatchDialogOpen}
                onClose={() => setEndMatchDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"경기 종료"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        경기를 종료하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEndMatchDialogOpen(false)}>취소</Button>
                    <Button onClick={() => {
                        setEndMatchDialogOpen(false)
                        handleEndMatchBtn()
                    }} autoFocus>확인</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={cancelMatchDialogOpen}
                onClose={() => setCancelMatchDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"경기 취소"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        경기를 취소하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelMatchDialogOpen(false)}>취소</Button>
                    <Button onClick={() => {
                        setCancelMatchDialogOpen(false)
                        handleCancelMatchBtn()
                    }} autoFocus>확인</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}