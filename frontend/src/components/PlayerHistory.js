import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Grid, ToggleButton, ToggleButtonGroup} from "@mui/material";
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
    const [alignment, setAlignment] = useState('name');

    useEffect(() => {
        getAllPlayers()
    }, []);

    async function getAllPlayers() {
        await axios
            .get("/api/all-players")
            .then((response) => {
                if (response.data.success) {
                    setPlayers(response.data.body)
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    function getPlayerFullName(playerDto) {
        return playerDto['name'] + " / " + playerDto['nickname']
    }

    function changeOrder(event, newAlignment) {
        setAlignment(newAlignment);
        if (newAlignment === 'winningPoints') {
            setPlayers([...players].sort((a, b) => b['winningPoints'] - a['winningPoints']))
        } else {
            setPlayers([...players].sort((a, b) => getPlayerFullName(a) > getPlayerFullName(b) ? 1 : -1))
        }
    }

    return (
        <Grid sx={{mt: 2, mx: 3}}>
            <h3>선수 이력</h3>
            <p align={"right"}>
                <ToggleButtonGroup color="primary" size={"small"} exclusive value={alignment} onChange={changeOrder}>
                    <ToggleButton value={"name"}>이름순</ToggleButton>
                    <ToggleButton value={"winningPoints"}>승점순</ToggleButton>
                </ToggleButtonGroup>
            </p>
            <TableContainer component={Paper}>
                <Table aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>이름</TableCell>
                            <TableCell align={"center"}>승 / 무 / 패<br/>득점 / 도움</TableCell>
                            <TableCell align={"center"}>승점</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            players ?
                                players.map((player) => {
                                    return (
                                        <TableRow key={player['playerId']}>
                                            <TableCell>{getPlayerFullName(player)}</TableCell>
                                            <TableCell
                                                align={"center"}>{player['winCnt'] + " / " + (player['matchCnt'] - player['winCnt'] - player['loseCnt']) + " / " + player['loseCnt']}
                                                <br/>{player['goalCnt'] + " / " + player['assistCnt']}</TableCell>
                                            <TableCell align={"center"}>{player['winningPoints']}</TableCell>
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