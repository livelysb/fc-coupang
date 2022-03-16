import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, Paper, styled} from "@mui/material";
import axios from "axios";
import AlertDto from "./global-components/AlertDto";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";
import {useSearchParams} from "react-router-dom";
import DateFormatter from "./global-components/DateFormatter";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function MatchHistoryDetail() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [match, setMatch] = useState(null);
    const [alertDto, setAlertDto] = useState(null);


    useEffect(() => {
        getMatchDetail()
    }, []);

    async function getMatchDetail() {
        await axios
            .get("/api/match?matchId=" + searchParams.get("matchId"))
            .then((response) => {
                if (response.data.success) {
                    setMatch(response.data.body)
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    function getPlayerFullName(playerDto) {
        return playerDto['name'] + " / " + playerDto['nickname']
    }

    function getTeamAPlayers() {
        return match['teamPlayerDtoList'].filter((player) => {
            return player['teamA']
        })
    }

    function getTeamBPlayers() {
        return match['teamPlayerDtoList'].filter((player) => {
            return !player['teamA']
        })
    }


    return (
        <Grid sx={{mt: 2, mx: 3}}>
            <h3>경기 기록 <small>- 경기 현황</small></h3>
            <Grid sx={{mb: 1}}>
                <p align={"right"}>
                    <strong>경기번호</strong>: {searchParams.get("matchId")}<br/>
                    <strong>시작시간</strong>: {match ? DateFormatter(match['createdAt']) : ''}
                </p>
            </Grid>
            {
                match ?
                    <Grid container spacing={2}>
                        <Grid xs={6} item justifyContent="center">
                            <Item>
                                <h4>Team A<Box style={{"color": "red"}}>{match['teamAScore']}</Box></h4>
                                {
                                    getTeamAPlayers().map((player) => {
                                        return (
                                            <Box mt={1} px={1} key={player['playerId']}>
                                                <Button variant={"outlined"}
                                                        value={player['playerId']}
                                                        fullWidth
                                                >{getPlayerFullName(player['playerDto']).substr(0, 10)}
                                                </Button>
                                            </Box>
                                        )
                                    })
                                }
                            </Item>
                        </Grid>
                        <Grid xs={6} item justifyContent="center">
                            <Item>
                                <h4>Team B<Box style={{"color": "red"}}>{match['teamBScore']}</Box></h4>
                                {
                                    getTeamBPlayers().map((player) => {
                                        return (
                                            <Box mt={1} px={1} key={player['playerId']}>
                                                <Button variant={"outlined"}
                                                        value={player['playerId']}
                                                        fullWidth
                                                >{getPlayerFullName(player['playerDto']).substr(0, 10)}
                                                </Button>
                                            </Box>
                                        )
                                    })
                                }
                            </Item>
                        </Grid>
                    </Grid>
                    : null
            }
            {
                match && match['goalDtoList'].length > 0 ?
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
                                            match['goalDtoList'].map(goal => (
                                                    <TableRow key={Math.random()}
                                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                        <TableCell component="th" scope="row">
                                                            {getTeamAPlayers().map(player => player.playerId).includes(goal['goalPlayerId']) ? 'A' : 'B'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getPlayerFullName(match['teamPlayerDtoList'].find(player => goal['goalPlayerId'] === player.playerId)['playerDto'])}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                goal.assistPlayerId ?
                                                                    getPlayerFullName(match['teamPlayerDtoList'].find(player => goal['assistPlayerId'] === player.playerId)['playerDto'])
                                                                    : null
                                                            }
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
                alertDto ?
                    <CustomizedSnackbar
                        key={alertDto.date}
                        message={alertDto.message}
                        severity={alertDto.severity}
                    /> : null
            }
        </Grid>
    )
}