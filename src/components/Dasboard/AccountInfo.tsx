import { Button, Input } from '@mui/material'
import React from 'react'
import { Roles } from '../../auth/authConfig'
import ProfileDetails from './ProfileDetails'

interface AccountInfoProps {
}
const AccountInfo = (props: AccountInfoProps) => {
  return (
    <div>
      <ProfileDetails />
      <br/><br/>
      {/* Test MUI <br/>
      <Button variant="text">MUI Text</Button><br />
      <Button variant="contained">MUI Contained</Button><br /> */}
    </div>
  )
}

export default AccountInfo