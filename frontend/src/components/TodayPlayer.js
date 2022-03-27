import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Grid} from "@mui/material";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";
import SimpleBackdrop from "./global-components/SimpleBackdrop";
import AlertDto from "./global-components/AlertDto";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Radio from "@mui/material/Radio";
import TableContainer from "@mui/material/TableContainer";


export default function TodayPlayer() {
    const [players, setPlayers] = useState(new Map());
    const [todayPlayers, setTodayPlayers] = useState(new Map());
    const [backdrop, setBackdrop] = useState(false);
    const [alertDto, setAlertDto] = useState(null);


    useEffect(() => {
        getAllPlayers().then(getTodayPlayers);
    }, []);

    async function getTodayPlayers() {
        await axios
            .get("/api/today-players")
            .then((response) => {
                if (response.data.success) {
                    response.data.body.forEach(todayPlayer => {
                        setTodayPlayers((prev) => new Map([...prev, [todayPlayer.playerId, todayPlayer]]));
                    })
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    async function getAllPlayers() {
        await axios
            .get("/api/all-players")
            .then((response) => {
                if (response.data.success) {
                    response.data.body.forEach(player => {
                        setPlayers((prev) => new Map([...prev, [player.playerId, player]]));
                    });
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    async function putTodayPlayer() {
        setBackdrop(true)
        await axios
            .post("/api/today-players",
                Array.from(todayPlayers).map(([, todayPlayer]) => {
                    return {
                        playerId: todayPlayer['playerId'],
                        name: todayPlayer['name'],
                        nickname: todayPlayer['nickname'],
                        defaultTeamNumber: todayPlayer['defaultTeamNumber']
                    }
                }))
            .then((response) => {
                setBackdrop(false)
                if (response.data.success) {
                    setAlertDto(AlertDto.Success("오늘의 선수명단 등록 완료"))
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    const handleFormat = (event) => {
        let playerId = parseInt(event.target.getAttribute('player-id'));
        let todayPlayer = todayPlayers.get(playerId)
        if (todayPlayer === undefined) {
            todayPlayer = players.get(playerId)
            todayPlayer['defaultTeamNumber'] = parseInt(event.target.value);
        } else {
            if (parseInt(event.target.value) === (todayPlayer ? todayPlayer['defaultTeamNumber'] : undefined)) {
                todayPlayer = undefined;
            } else {
                todayPlayer['defaultTeamNumber'] = parseInt(event.target.value);
            }
        }
        if (todayPlayer === undefined) {
            setTodayPlayers((prev) => {
                const map = new Map(prev);
                map.delete(playerId);
                return map;
            });
        } else {
            setTodayPlayers((prev) => new Map(prev).set(playerId, todayPlayer));
        }
    };

    return (
        <Box sx={{mt: 2, mx: 3, mb: 3}}>
            <h3>오늘의 선수명단</h3>
            <Grid sx={{mb: 1}}>
                <div align={"right"}> 참석인원
                    : {Array.from(todayPlayers).length} 명
                </div>
            </Grid>

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>이름 / 닉네임</TableCell>
                            <TableCell align={"center"}>1
                                ({Array.from(todayPlayers).filter(([, todayPlayer]) => todayPlayer['defaultTeamNumber'] === 1).length})</TableCell>
                            <TableCell align={"center"}>2
                                ({Array.from(todayPlayers).filter(([, todayPlayer]) => todayPlayer['defaultTeamNumber'] === 2).length})</TableCell>
                            <TableCell align={"center"}>3
                                ({Array.from(todayPlayers).filter(([, todayPlayer]) => todayPlayer['defaultTeamNumber'] === 3).length})</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Array.from(players).map(([, player]) => {
                                const todayPlayer = todayPlayers.get(player['playerId']);
                                return (
                                    <TableRow
                                        key={player['playerId']}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">
                                            {player['name'] + " / " + player['nickname']}
                                        </TableCell>
                                        <TableCell>
                                            <Radio
                                                size={"small"}
                                                checked={(todayPlayer ? todayPlayer['defaultTeamNumber'] : undefined) === 1}
                                                onClick={handleFormat}
                                                value="1"
                                                name="radio-buttons"
                                                inputProps={{'player-id': player['playerId']}}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Radio
                                                size={"small"}
                                                checked={(todayPlayer ? todayPlayer['defaultTeamNumber'] : undefined) === 2}
                                                onClick={handleFormat}
                                                value="2"
                                                name="radio-buttons"
                                                inputProps={{'player-id': player['playerId']}}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Radio
                                                size={"small"}
                                                checked={(todayPlayer ? todayPlayer['defaultTeamNumber'] : undefined) === 3}
                                                onClick={handleFormat}
                                                value="3"
                                                name="radio-buttons"
                                                inputProps={{'player-id': player['playerId']}}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Box m={3}>
                <Grid container justifyContent="flex-end">
                    <Button type="button" variant="contained" onClick={putTodayPlayer}>
                        저장
                    </Button>
                </Grid>
            </Box>

            <SimpleBackdrop open={backdrop}/>
            {
                alertDto ?
                    <CustomizedSnackbar
                        key={alertDto.date}
                        message={alertDto.message}
                        severity={alertDto.severity}
                    /> : null
            }
        </Box>
    );
};