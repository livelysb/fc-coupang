import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {Link} from "react-router-dom";

export default function MenuAppBar() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        FC Coupang
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem component={Link} to="/" onClick={handleClose}>오늘의 선수명단</MenuItem>
                            <MenuItem component={Link} to="/match-record" onClick={handleClose}>경기 기록</MenuItem>
                            <MenuItem component={Link} to="/match-history" onClick={handleClose}>경기 결과</MenuItem>
                            <MenuItem component={Link} to="/player-history" onClick={handleClose}>선수 이력</MenuItem>
                            <MenuItem component={Link} to="/player-register" onClick={handleClose}>선수 등록</MenuItem>

                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
