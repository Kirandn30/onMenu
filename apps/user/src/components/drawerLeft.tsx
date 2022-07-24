import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { getAuth, signOut } from 'firebase/auth';
import { Alert } from '@mui/material';

const drawerWidth = 200;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function DrawerLeft() {

  const theme = useTheme();
  const navigate = useNavigate()
  const { shopId } = useParams()
  const { selectedBranch } = useSelector((state: RootState) => state.appSlice)
  const [selectAlert, setSelectAlert] = React.useState(false)

  const [open, setOpen] = React.useState(false);

  const listItems = [
    {
      icon: <LocationOnOutlinedIcon />,
      listName: "Location",
      clickFunc: () => {
        navigate(`/${shopId}`)
      }
    },
    {
      icon: <AccessTimeOutlinedIcon />,
      listName: "Timings",
      clickFunc: () => {
        console.log("time clicked");
      }
    },
    {
      icon: <ArticleOutlinedIcon />,
      listName: "Menu Page",
      clickFunc: () => {
        if (selectedBranch) {
          setSelectAlert(false)
          navigate(`/${shopId}/${selectedBranch.id}`)
        } else {
          setSelectAlert(true)
        }
      }
    },
    {
      icon: <PaymentIcon />,
      listName: "Payment",
      clickFunc: () => {
        navigate(`/${shopId}/payment`)
      }
    },
    {
      icon: <ShieldOutlinedIcon />,
      listName: "Terms & Condition",
      clickFunc: () => {
        // navigate(`/${shopId}/`)
      }
    },
    {
      icon: <LockOutlinedIcon />,
      listName: "Privacy Policy",
      clickFunc: () => {
        // navigate(`/${shopId}/`)
      }
    },
    {
      icon: <InfoOutlinedIcon />,
      listName: "About Onmenu",
      clickFunc: () => {
        // navigate(`/${shopId}/`)
      }
    },
    {
      icon: <LogoutOutlinedIcon />,
      listName: "Logout",
      clickFunc: () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
      }
    },

  ]

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box >
      <CssBaseline />
      <IconButton
        color="inherit"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{ mr: 2, ...(open && { visibility: 'hidden' }), margin: "2px 10px" }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        sx={{
          border: "none",
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth + 20,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {(selectAlert && !selectedBranch) && <Alert severity="warning">Please select the branch!</Alert>}

        <List>
          {listItems.map(item => (
            <ListItem key={item.listName} disablePadding>
              <ListItemButton onClick={item.clickFunc}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.listName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

      </Drawer>

    </Box>
  );
}
