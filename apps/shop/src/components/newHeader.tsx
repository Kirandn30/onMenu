import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { PeopleAltOutlined, DocumentScannerOutlined, FormatListBulletedOutlined, LoyaltyOutlined, WarningAmberOutlined, AssessmentOutlined, AccountBalanceOutlined, SettingsOutlined, InfoOutlined, DeleteOutlined, LoginOutlined, PersonOutlineOutlined, NotificationsNoneOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Simplemodal } from './modal';
import { Button } from '@mui/material';
import { useEmailPassword } from '../hooks/emailPassword';
import { app } from "../config/firebase"

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export function NewHeader({ children }: { children: React.ReactNode }) {

    const theme = useTheme();
    const [open, setOpen] = React.useState(false)
    const { logOut } = useEmailPassword({ app })
    const { User } = useSelector((state: RootState) => state.auth)
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const { selectedBranch } = useSelector((state: RootState) => state.branches)
    const [modal, setModal] = React.useState(false)
    const [selectedOption, setSelectedOption] = React.useState("Menu Page")
    const navigate = useNavigate()
    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const navData = [
        {
            icon: <DocumentScannerOutlined />,
            name: 'Menu Page',
            route: `${selectedBranch?.id}/menu`
        },
        {
            icon: <PeopleAltOutlined />,
            name: 'Active Customers',
            route: "activecustomers"
        },
        {
            icon: <LoyaltyOutlined />,
            name: 'Loyalty Alert',
            route: "loyalty"
        },
        {
            icon: <WarningAmberOutlined />,
            name: "Service Alert",
            route: "alerts"
        },
        {
            icon: <AssessmentOutlined />,
            name: "Analytics",
            route: "analytics"
        },
        {
            icon: <AccountBalanceOutlined />,
            name: "Payments",
            route: "payment"
        },
        {
            icon: <SettingsOutlined />,
            name: "Settings",
            route: "settings"
        },
        {
            icon: <InfoOutlined />,
            name: "Instructions",
            route: "instructions"
        },
        {
            icon: <DeleteOutlined />,
            name: "Bin",
            route: "bin"
        },
        {
            icon: <LoginOutlined />,
            name: "Logout",
        }]


    return (

        <Box sx={{ display: 'flex' }}>
            <Simplemodal open={modal} onClose={() => setModal(false)}>
                <div style={{ marginTop: "20px", display: "grid", gap: "30px" }}>
                    <Typography variant='h5'>Are you sure you want to <br /> logout</Typography>
                    <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
                        <Button onClick={() => setModal(false)} variant='outlined'>Cancel</Button>
                        <Button onClick={() => logOut()} variant='contained'>Logout</Button>
                    </div>
                </div>
            </Simplemodal>
            <CssBaseline />
            <AppBar position="fixed" open={open} color="inherit">
                <Toolbar style={{ justifyContent: "space-between" }}>
                    <IconButton
                        className="menu"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div style={{ display: "flex", gap: "40px", width: "100%" }}>
                        <Typography className="menu" style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap", cursor: "pointer"
                        }} variant="subtitle2" component="div">
                            Home
                        </Typography>
                        <Typography className="menu" style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap", cursor: "pointer"
                        }} variant="subtitle2" component="div">
                            Menu under work
                        </Typography>
                        <Typography className="menu" style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap", cursor: "pointer"
                        }} variant="subtitle2" component="div">
                            Publish Menu
                        </Typography>
                        <Typography className="menu" style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap", cursor: "pointer"
                        }} variant="subtitle2" component="div">
                            Download QR
                        </Typography>
                        <Typography className="menu" style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap", cursor: "pointer"
                        }} variant="subtitle2" component="div">
                            Contact <strong style={{ color: '#007AFF', cursor: "pointer" }}> On Menu</strong>
                        </Typography>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr 1fr", justifyContent: "center" }}>
                        <PersonOutlineOutlined />
                        <Typography style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}>{User?.email}</Typography>
                        <NotificationsNoneOutlined className="menu" style={{ marginLeft: "10px", cursor: "pointer" }} />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={() => setOpen(false)}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {navData.map((data) => (
                        <ListItem className="menu" key={data.name} disablePadding sx={{ display: 'block' }} onClick={() => {
                            setSelectedOption(data.name)
                            if (data.name === "Logout") {
                                setModal(true)
                            } else {
                                navigate(`/${selectedShop?.id}/${data.route}`)
                            }
                        }} >
                            <ListItemButton
                                className="menu"
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className="menu"
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {data.icon}
                                </ListItemIcon>
                                <ListItemText primary={data.name} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer >
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box >
    );
}

