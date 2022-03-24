import React, {useState} from "react";
import axios from "axios";
import {Box, Button, Grid, TextField} from "@mui/material";
import SimpleBackdrop from "./global-components/SimpleBackdrop";
import CustomizedSnackbar from "./global-components/CustomizedSnackBar";
import AlertDto from "./global-components/AlertDto";

export default function PlayerRegistration() {
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [backdrop, setBackdrop] = useState(false);
    const [alertDto, setAlertDto] = useState(null);

    function onNameChange(e) {
        setName(e.target.value)
    }

    function onNicknameChange(e) {
        setNickname(e.target.value)
    }

    async function registerMember(e) {
        e.preventDefault()
        setBackdrop(true)
        await axios
            .post("/api/player", {
                    name: name.trim(),
                    nickname: nickname.trim()
                }
            ).then((response) => {
                setBackdrop(false)
                if (response.data.success) {
                    setAlertDto(AlertDto.Success("선수 등록 완료"))
                    setName("");
                    setNickname("");
                } else {
                    setAlertDto(AlertDto.Error(response.data.message))
                }
            });
    }

    return (
        <Box sx={{mt: 2, mx: 3}}>
            <h3>선수 등록</h3>
            <form onSubmit={registerMember}>
                <Box m={1}>
                    <TextField
                        onChange={onNameChange}
                        value={name}
                        label={"이름"}
                        required
                        variant="standard"
                    />
                </Box>
                <Box m={1}>
                    <TextField
                        onChange={onNicknameChange}
                        value={nickname}
                        label={"닉네임"}
                        variant="standard"
                    />
                </Box>
                <Box m={3}>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="submit">
                            등록
                        </Button>
                    </Grid>
                </Box>
            </form>
            <SimpleBackdrop open={backdrop}/>
            {
                alertDto ?
                    <CustomizedSnackbar
                        key = {alertDto.date}
                        message={alertDto.message}
                        severity={alertDto.severity}
                    /> : null
            }
        </Box>

    )
};