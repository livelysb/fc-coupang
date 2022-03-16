import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import axios from "axios";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";
import AlertDto from "./global-components/AlertDto";

export default function PlayerHistory() {

    const [players, setPlayers] = useState([]);
    const [alertDto, setAlertDto] = useState(null);

    useEffect(() => {
        getAllPlayers()
    }, []);

    async function getAllPlayers() {
        await axios
            .get("/api/all-players")
            .then((response) => {
                if (response.data.success) {
                    console.log(response.data.body)
                    setPlayers(response.data.body)
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    function getPlayerFullName(playerDto) {
        return playerDto['name'] + " / " + playerDto['nickname']
    }

    return (
        <Grid sx={{mt: 2, mx: 3}}>
            <h3>선수 이력</h3>
            <TableContainer component={Paper}>
                <Table aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>이름</TableCell>
                            <TableCell>승/무/패</TableCell>
                            <TableCell>득점</TableCell>
                            <TableCell>도움</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            players ?
                                players.map((player) => {
                                    return (
                                        <TableRow key={player['playerId']}>
                                            <TableCell>{getPlayerFullName(player)}</TableCell>
                                            <TableCell>{player['winCnt'] + " / " + (player['matchCnt'] - player['winCnt'] - player['loseCnt']) + " / " + player['loseCnt']}</TableCell>
                                            <TableCell>{player['goalCnt']}</TableCell>
                                            <TableCell>{player['assistCnt']}</TableCell>
                                        </TableRow>
                                    )
                                }) : null
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
    );
};