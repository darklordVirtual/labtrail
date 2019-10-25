import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import DirectionsIcon from '@material-ui/icons/Directions'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
import PeopleIcon from '@material-ui/icons/People'
import PermDeviceInformation from '@material-ui/icons/PermDeviceInformation'
import Person from '@material-ui/icons/Person'
import HeaderLoginButton from './HeaderLoginButton'
import { GET_CURRENT_USER } from './queries'
import { useQuery } from '@apollo/react-hooks'
import SettingsIcon from '@material-ui/icons/Settings'
import { hasRole } from './helpers'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Divider from '@material-ui/core/Divider'
import HeaderSearch from './HeaderSearch'

const drawerWidth = 240

// Styles for menu bar and drawer
const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  drawer: {
    width: drawerWidth
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  link: {
    textDecoration: 'none'
  }
}))

const Header = () => {
  const classes = useStyles()

  // Hooks
  const [open, setOpen] = React.useState(false)
  const { data } = useQuery(GET_CURRENT_USER)

  // Function to toggle drawer menu via open state
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <AppBar position='static'>

      <Toolbar>
        <IconButton
          onClick={toggleDrawer}
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='menu'
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title}>
          LabTrail
        </Typography>
        <HeaderSearch />
        <HeaderLoginButton user={data ? data.currentUser : null} />
      </Toolbar>

      <Drawer
        open={open}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
        onClick={toggleDrawer}
      >

        <MenuItem className={classes.drawerHeader} onClick={toggleDrawer}>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
        </MenuItem>
        <Divider />
        <Link to='/' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </MenuItem>
        </Link>
        {hasRole((data && data.currentUser), ['ADMIN', 'MANAGER']) && <Link to='/stations' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <PermDeviceInformation />
            </ListItemIcon>
            <ListItemText>Stations</ListItemText>
          </MenuItem>
        </Link>}
        {hasRole((data && data.currentUser), ['ADMIN', 'MANAGER']) && <Link to='/documents' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <DirectionsIcon />
            </ListItemIcon>
            <ListItemText>Documents</ListItemText>
          </MenuItem>
        </Link>}
        {hasRole((data && data.currentUser), ['ADMIN', 'MANAGER']) && <Link to='/categories' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <BookmarkIcon />
            </ListItemIcon>
            <ListItemText>Categories</ListItemText>
          </MenuItem>
        </Link> }
        {hasRole((data && data.currentUser), ['ADMIN']) && <Link to='/tenants' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <SupervisedUserCircleIcon />
            </ListItemIcon>
            <ListItemText>Tenants</ListItemText>
          </MenuItem>
        </Link>}
        {hasRole((data && data.currentUser), ['ADMIN']) && <Link to='/users' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText>Users</ListItemText>
          </MenuItem>
        </Link>}
        {hasRole((data && data.currentUser), ['ADMIN', 'MANAGER']) && <Link to='/settings' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
        </Link>}
        {(data && data.currentUser) && <Link to='/profile' className={classes.link}>
          <MenuItem>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
        </Link>}

      </Drawer>
    </AppBar>
  )
}

export default Header
