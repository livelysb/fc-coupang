import React, {useEffect, useState} from 'react';
import {Box, Button} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";
import AlertDto from "./global-components/AlertDto";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";


class MatchDto {
    matchId: number
    matchDate: string
    teamAScore: number
    teamBScore: number

    constructor(matchId: number, matchDate: string, teamAScore: number, teamBScore: number) {
        this.matchId = matchId;
        this.matchDate = matchDate;
        this.teamAScore = teamAScore;
        this.teamBScore = teamBScore;
    }
}

export default function MatchHistory() {

    const [matches, setMatches] = useState([]);
    const [alertDto, setAlertDto] = useState(null);


    useEffect(() => {
        getRecentMatches()
    }, []);

    async function getRecentMatches() {
        await axios
            .get('/api/matches/recent' + ((matches.length === 0) ? '' : ('?lastMatchId=' + matches[matches.length - 1].matchId)))
            .then((response) => {
                if (response.data.success) {
                    setMatches((prev => {
                        return [...prev, ...response.data.body.map((match) => {
                            return new MatchDto(match.matchId, match.matchDate, match.teamAScore, match.teamBScore)
                        })]
                    }))
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    return (
        <Box sx={{mt: 2, mx: 3}}>
            <h3>경기 결과</h3>
            <TableContainer component={Paper}>
                <Table aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>날짜</TableCell>
                            <TableCell>A</TableCell>
                            <TableCell>B</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            matches ?
                                matches.map((match) => {
                                    return (
                                        <TableRow key={match.matchId}>
                                            <TableCell>{match.matchId}</TableCell>
                                            <TableCell>{match.matchDate}</TableCell>
                                            <TableCell>{match.teamAScore}</TableCell>
                                            <TableCell>{match.teamBScore}</TableCell>
                                        </TableRow>
                                    )
                                }) : null
                        }
                        {
                            matches && matches.length % 5 === 0 ?
                                <TableRow><TableCell align={'center'} colSpan={4}><Button variant="text"
                                                                                          onClick={getRecentMatches}>더보기</Button></TableCell></TableRow>
                                : null
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                alertDto ?
                    <CustomizedSnackbar
                        key={alertDto.date}
                        message={alertDto.message}
                        severity={alertDto.severity}
                    /> : null
            }
        </Box>
    )
}