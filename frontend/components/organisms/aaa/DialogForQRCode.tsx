import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DialogToGetSignInToken from './DialogToGetSignInToken'
import QRCode from 'qrcode-generator'

type Props = {
  open: boolean
  closeHandler: () => void
}

const Component: React.FC<Props> = (props: Props) => {
  const { open, closeHandler } = props
  const [data, setData] = useState(null)
  const [imageURL, setImageURL] = useState()
  const [imageAlt, setImageAlt] = useState()
  const [openSignInDialog, setOpenSignInDialog] = useState(false)
  const qrcode = QRCode(0, 'L')

  useEffect(() => {
    setOpenSignInDialog(!data)
  }, [])

  useEffect(() => {
    console.log(`signInToken: `, data)
    if (data) {
      setImageAlt(data)
      qrcode.addData(data)
      qrcode.make()
      const cellSize = 8
      const url = qrcode.createDataURL(cellSize)
      setImageURL(url)
    }
  }, [data])

  const signInLinkClickHandler = (): void => {
    setOpenSignInDialog(true)
  }

  const closeLinkOnSignInDialogClickHandler = (data: string): void => {
    console.log(`get data: `, data)
    setData(data)
    setOpenSignInDialog(false)
  }

  return (
    <Dialog
      open={open}
      onClose={closeHandler}
      aria-labelledby="qrcode-dialog-title"
      aria-describedby="qrcode-dialog-description"
    >
      <DialogTitle id="qrcode-dialog-title">
        (dev)QRCode for Sign in
      </DialogTitle>
      <DialogContent>
        {imageURL && <img src={imageURL} alt={imageAlt} />}
        <DialogContentText>
          You can save the QRCode as a image.
        </DialogContentText>
        <DialogToGetSignInToken
          open={openSignInDialog}
          closeHandler={closeLinkOnSignInDialogClickHandler}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={signInLinkClickHandler} color="primary">
          Sign In
        </Button>
        <Button onClick={closeHandler} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Component
