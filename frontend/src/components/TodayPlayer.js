import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Grid, ToggleButton, ToggleButtonGroup} from "@mui/material";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";
import SimpleBackdrop from "./global-components/SimpleBackdrop";
import AlertDto from "./global-components/AlertDto";


export default function TodayPlayer() {
    const baseUrl = "http://kev-home.iptime.org:8080";
    const [players, setPlayers] = useState(null);
    const [selected, setSelected] = useState([]);
    const [backdrop, setBackdrop] = useState(false);
    const [alertDto, setAlertDto] = useState(null);


    useEffect(() => {
        getAllPlayers().then(() => getTodayPlayers())
    }, []);

    async function getTodayPlayers() {
        await axios
            .get(baseUrl + "/today-players")
            .then((response) => {
                if (response.data.success) {
                    setSelected(response.data.body.map((player) => {
                        return player.playerId
                    }))
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    async function getAllPlayers() {
        await axios
            .get(baseUrl + "/all-players")
            .then((response) => {
                if (response.data.success) {
                    setPlayers(response.data.body)
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    async function putTodayPlayer() {
        setBackdrop(true)
        await axios
            .post(baseUrl + "/today-players", selected)
            .then((response) => {
                setBackdrop(false)
                if (response.data.success) {
                    setAlertDto(AlertDto.Success("오늘의 선수명단 등록 완료"))
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            })
    }

    const handleFormat = (event, newFormats) => {
        setSelected(newFormats);
    };

    return (
        <Box sx={{mt: 2, mx: 3, mb: 3}}>
            <h3>오늘의 선수명단</h3>
            <div align={"right"}> 참석인원 : {selected.length} 명</div>
            <ToggleButtonGroup
                orientation="vertical"
                value={selected}
                onChange={handleFormat}
            >
                {
                    players ?
                        players.map((player) => {
                            return (
                                <ToggleButton
                                    key={player.playerId}
                                    value={player.playerId}
                                    size="small"
                                >{player.name} / {player.nickname}</ToggleButton>
                            )
                        }) : null
                }
            </ToggleButtonGroup>
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