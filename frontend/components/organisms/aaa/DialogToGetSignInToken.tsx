import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid
} from '@material-ui/core'
import React from 'react'
import { SignInFormFragment } from '.'
import { concatSignInTokenAndPassphrase } from 'lib/aaa'
import fetchGraphQLData from 'lib/graphql/request'
import gql from 'graphql-tag'
import useForm from 'react-hook-form'

type Props = {
  open: boolean
  closeHandler: (data: string) => void
}

const Component: React.FC<Props> = (props: Props) => {
  const { open, closeHandler } = props
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data): Promise<void> => {
    console.log(`Get sign in token: ${JSON.stringify(data)}`)
    const { email, password } = data
    const query = gql`
      mutation {
        getSignInToken(
          email: "${email}",
          password: "${password}"
        ) {
          id
          passphrase
          userId
          expiresAt
        }
      }
    `
    console.log(`query: `, query)
    await fetchGraphQLData(query, 'getSignInToken')
      .then(signInToken => {
        console.log(`signInToken: `, signInToken)
        const data = concatSignInTokenAndPassphrase(
          signInToken['id'],
          signInToken['passphrase']
        )
        console.log(`put data: `, data)
        closeHandler(data)
        return signInToken
      })
      .catch(reason => {
        console.log(`reason: `, reason)
      })
  }

  return (
    <Dialog
      open={open}
      onClose={closeHandler}
      aria-labelledby="sign-in-dialog-title"
      aria-describedby="sign-in-dialog-description"
    >
      <DialogTitle id="sign-in-dialog-title">Sign in</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} justify="center">
            <SignInFormFragment register={register} xs={10} />
            <Grid item xs={10}>
              <Button type="submit" color="primary" variant="contained">
                Sign in
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={(): void => closeHandler(null)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Component
