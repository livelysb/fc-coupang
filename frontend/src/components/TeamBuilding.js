import React, {useEffect, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import axios from "axios";
import AlertDto from "./global-components/AlertDto";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";
import {useNavigate} from "react-router-dom";

class PlayerDto {
    playerId: number
    name: string
    team: string

    constructor(playerId, name, team) {
        this.playerId = playerId
        this.name = name
        this.team = team
    }
}


export default function TeamBuilding() {

    const [players, setPlayers] = React.useState(new Map());
    const [alertDto, setAlertDto] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    let navigate = useNavigate()

    async function getTodayPlayers() {
        await axios
            .get("/api/today-players")
            .then((response) => {
                if (response.data.success) {
                    const playerList = response.data.body.map((player) => new PlayerDto(player.playerId, player.name + " / " + player.nickname, ''))
                    playerList.forEach(player =>
                        setPlayers((prev) => new Map([...prev, [player.playerId, player]])))

                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    function handleStartMatchBtn() {
        if (Array.from(players).filter(([, value]) => value.team === 'a').length !== Array.from(players).filter(([, value]) => value.team === 'b').length) {
            setConfirmDialogOpen(true)
        } else {
            startMatch()
        }
    }

    async function startMatch() {
        await axios
            .post("/api/match", {
                playerList: Array.from(players).filter(([, value]) => value.team !== '').map(([, player]) => {
                    return {
                        playerId: player.playerId,
                        teamA: player.team === 'a'
                    }
                })
            })
            .then((response) => {
                if (response.data.success) {
                    navigate("/dashboard?matchId=" + response.data.body, {replace: true})
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }


    useEffect(() => {
        getTodayPlayers()
    }, []);


    const handleChange = (event) => {
        const player = players.get(parseInt(event.target.getAttribute('player-id')))
        if (event.target.value === players.get(parseInt(event.target.getAttribute('player-id'))).team) {
            player.team = ''
        } else {
            player.team = event.target.value
        }
        setPlayers((prev) => new Map(prev).set(parseInt(event.target.getAttribute('player-id')), player));
    };

    return (
        <Box sx={{mt: 2, mx: 3}}>
            <h3>경기 기록 <small>- 팀 구성</small></h3>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>이름 / 닉네임</TableCell>
                            <TableCell align={"center"}>A
                                ({Array.from(players).filter(([, value]) => value.team === 'a').length})</TableCell>
                            <TableCell align={"center"}>B
                                ({Array.from(players).filter(([, value]) => value.team === 'b').length})</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Array.from(players).map(([key, value]) => (
                                <TableRow
                                    key={key}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {value.name}
                                    </TableCell>
                                    <TableCell>
                                        <Radio
                                            size={"small"}
                                            checked={value.team === 'a'}
                                            onClick={handleChange}
                                            value="a"
                                            name="radio-buttons"
                                            inputProps={{'player-id': key}}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Radio
                                            size={"small"}
                                            checked={value.team === 'b'}
                                            onClick={handleChange}
                                            value="b"
                                            name="radio-buttons"
                                            inputProps={{'player-id': key}}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box m={3}>
                <Grid container justifyContent="flex-end">
                    <Button variant="contained" onClick={handleStartMatchBtn}>경기 시작</Button>
                </Grid>
            </Box>
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"양 팀 인원수가 동일하지 않습니다."}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        계속 진행하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>취소</Button>
                    <Button onClick={() => {
                        setConfirmDialogOpen(false)
                        startMatch()
                    }} autoFocus>확인</Button>
                </DialogActions>
            </Dialog>
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
}