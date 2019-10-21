import { Link, TableCell } from '@material-ui/core'
import React, { useState } from 'react'
import DialogForQRCode from './DialogForQRCode'

const Component: React.FC = () => {
  const [openQRCodeDialog, setOpenQRCodeDialog] = useState(false)

  const openLinkClickHandler = (): void => {
    setOpenQRCodeDialog(true)
  }

  const closeLinkOnDialogClickHandler = (): void => {
    setOpenQRCodeDialog(false)
  }

  return (
    <TableCell>
      <Link onClick={openLinkClickHandler}>Open</Link>
      <DialogForQRCode
        open={openQRCodeDialog}
        closeHandler={closeLinkOnDialogClickHandler}
      />
    </TableCell>
  )
}

export default Component
