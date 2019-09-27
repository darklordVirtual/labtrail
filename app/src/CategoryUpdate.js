import React from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import CategoryForm from './CategoryForm'
import CategoryDelete from './CategoryDelete'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_CATEGORY, GET_CATEGORIES, CREATE_ALERTCLIENT } from './queries'
import { makeStyles } from '@material-ui/core/styles'
import Error from './Error'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}))

const CategoryUpdate = ({ category }) => {
  const classes = useStyles()

  // Get hook for Category update
  const [updateCategory, { data, error }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{
      query: GET_CATEGORIES
    }]
  })
  const [createAlert] = useMutation(CREATE_ALERTCLIENT, { variables: { message: 'Category saved!', type: 'SUCCESS' } })

  if (error) return <Error message={error.message} />

  // Redirect if update is successful
  if (data && data.updateCategory.success) {
    createAlert()
    return <Redirect to='/categories' />
  }

  // Form on submit method
  function onSubmit (category) {
    updateCategory({ variables: category })
  }

  return (
    <CategoryForm category={category} onSubmit={onSubmit}>
      <Link to='/categories'>
        <Button
          variant='contained'
          color='secondary'
          className={classes.button}
        >
          Cancel
        </Button>
      </Link>
      <CategoryDelete category={category} />
      <Button
        variant='contained'
        color='primary'
        type='submit'
        className={classes.button}
      >
        Save
      </Button>
    </CategoryForm>
  )
}

CategoryUpdate.propTypes = {
  category: PropTypes.object.isRequired
}

export default CategoryUpdate