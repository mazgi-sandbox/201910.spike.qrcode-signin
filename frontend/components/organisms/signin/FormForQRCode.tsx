import { Button, Grid, Paper, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import Link from 'next/link'
import QrReader from 'react-qr-reader'
import Router from 'next/router'
import fetchGraphQLData from 'lib/graphql/request'
import gql from 'graphql-tag'
import { splitSignInTokenAndPassphrase } from 'lib/aaa'
import useForm from 'react-hook-form'

function getReader(scanHandler, errorHander): QrReader {
  if (!process.browser) {
    return null
  }
  const reader = <QrReader onScan={scanHandler} onError={errorHander} />
  return reader
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  }
}))

const Component: React.FC = () => {
  const classes = useStyles('')
  const { handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const onSubmit = (data): void => {
    console.log(`Sign in: ${JSON.stringify(data)}`)
  }
  const scanHandler = async (data): Promise<void> => {
    if (!data || loading) {
      return
    }
    setLoading(true)
    console.log(`data: `, data)
    //TODO:
    const [signInToken, passphrase] = splitSignInTokenAndPassphrase(data)

    // sign in
    const query = gql`
        mutation {
          signIn(
            token: "${signInToken}"
            passphrase: "${passphrase}"
          ) {
            id
            name
            displayName
            email
          }
        }
      `
    console.log(`query: `, query)
    await fetchGraphQLData(query, 'signIn')
      .then(user => {
        console.log(`signIn: `, user)
        //TODO: store user to redux store.

        setLoading(false)
        Router.push('/profile')
      })
      .catch(reason => {
        console.log(`reason: `, reason)
        setLoading(false)
      })
  }
  const scanErrorHandler = (error): void => {
    console.log(`error: `, error)
  }

  return (
    <Paper className={classes.paper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={8}>
            {getReader(scanHandler, scanErrorHandler)}
          </Grid>
          <Grid item xs={10}>
            <Button type="submit" color="primary" variant="contained">
              Sign in
            </Button>
            <Link href="/signin">Sign in with Email & Password</Link>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default Component
