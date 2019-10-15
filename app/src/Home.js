import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(2, 0)
  },
  paper: {
    padding: theme.spacing(3, 2)
  },
  logo: {
    height: '100px',
    width: '100px'
  }
}))

const Home = () => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <img src='/favicon.png' className={classes.logo} alt='Logo' />
      <Typography className={classes.title} variant='h3' component='h1'>
        LabTrail
      </Typography>
      <Typography component='p'>
        LabTrail is the central platform to manage the destinations of QR-Codes. Register new QR-Codes and define multiple link targets. Manage users and assign them to tenants. Switch easily between tenants and their active QR-Code category.
      </Typography>
    </Paper>
  )
}

export default Home
