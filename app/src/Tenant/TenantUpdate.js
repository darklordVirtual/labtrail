import React from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TenantForm from './TenantForm'
import TenantDelete from './TenantDelete'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_TENANT, GET_TENANTS, GET_TENANT, CREATE_ALERTCLIENT } from '../queries'
import { makeStyles } from '@material-ui/core/styles'
import Error from '../Error'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1, 1, 1, 0)
  }
}))

const TenantUpdate = ({ tenant }) => {
  const classes = useStyles()

  const [createAlert] = useMutation(CREATE_ALERTCLIENT)
  // Get hook for Tenant update
  const [updateTenant, { data, error }] = useMutation(UPDATE_TENANT, {
    refetchQueries: [
      {
        query: GET_TENANTS
      },
      {
        query: GET_TENANT,
        variables: { id: tenant.id }
      }
    ],
    onCompleted: () => createAlert({ variables: { message: 'Tenant saved!', type: 'SUCCESS' } })
  })

  if (error) return <Error message={error.message} />

  // Redirect if update is successful
  if (data && data.updateTenant.success) {
    return <Redirect to='/tenants' />
  }

  // Form on submit method
  const onSubmit = (tenant) => {
    // Ensure document array is list of ids
    if (tenant.assigned_users && tenant.assigned_users[0] && tenant.assigned_users[0].id) {
      tenant.assigned_users = tenant.assigned_users.map(({ id }) => id)
    }
    updateTenant({ variables: tenant })
  }

  return (
    <TenantForm tenant={tenant} onSubmit={onSubmit}>
      <Button
        variant='contained'
        color='primary'
        type='submit'
        className={classes.button}
      >
        Save
      </Button>
      <Link to='/tenants'>
        <Button
          variant='outlined'
          color='secondary'
          className={classes.button}
        >
          Cancel
        </Button>
      </Link>
      <TenantDelete tenant={tenant} />
    </TenantForm>
  )
}

TenantUpdate.propTypes = {
  tenant: PropTypes.object.isRequired
}

export default TenantUpdate
