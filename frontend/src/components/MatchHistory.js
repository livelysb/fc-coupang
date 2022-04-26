import React, {useEffect, useState} from 'react';
import {Box, Button, Grid} from "@mui/material";
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
import {useNavigate} from "react-router-dom";

export default function MatchHistory() {

    const navigate = useNavigate()
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
                            return {
                                'matchId': match.matchId,
                                'matchDate': match.matchDate,
                                'status': match.status,
                                'statusDescription': match.statusDescription,
                                'teamAScore': match.teamAScore,
                                'teamBScore': match.teamBScore
                            }
                        })]
                    }))
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    return (
        <Grid sx={{mt: 2, mx: 3}}>
            <h3>경기 결과</h3>
            <TableContainer component={Paper}>
                <Table aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>경기일</TableCell>
                            <TableCell>상태</TableCell>
                            <TableCell>A</TableCell>
                            <TableCell>B</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            matches ?
                                matches.map((match) => {
                                    return (
                                        <TableRow key={match.matchId}
                                                  onClick={() => {
                                                      if(match.status === 'IN_PROGRESS') {
                                                          navigate("/dashboard?matchId=" + match.matchId)
                                                      } else {
                                                          navigate("/match-history-detail?matchId=" + match.matchId);
                                                      }

                                                  }}>
                                            <TableCell><Box sx={{color: 'info.main'}}>{match.matchId}</Box></TableCell>
                                            <TableCell>{match.matchDate}</TableCell>
                                            <TableCell>{match.statusDescription}</TableCell>
                                            <TableCell>{match.teamAScore}</TableCell>
                                            <TableCell>{match.teamBScore}</TableCell>
                                        </TableRow>
                                    )
                                }) : null
                        }
                        {
                            matches.length > 0 && matches.length % 5 === 0 ?
                                <TableRow>
                                    <TableCell align={'center'} colSpan={4}>
                                        <Button variant="text" onClick={getRecentMatches}>더보기</Button>
                                    </TableCell>
                                </TableRow>
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
        </Grid>
    )
}