import React, { useState } from 'react'
import logo from "../../assets/images/logo.png"
import otpImg from "../../assets/images/otpImg.svg"
import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import OtpInput from 'react-otp-input';

type Props = {
  verifyOtp: (otp: string) => void
}


// eslint-disable-next-line no-empty-pattern
export default function VerifyOtp({ verifyOtp }: Props) {
  const { phoneNumber, error } = useSelector((state: RootState) => state.User)
  const [otp, setOtp] = useState<string | undefined>(undefined)

  return (
    <div id='card' style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
      <img src={logo} alt="logo" />
      <Typography variant='h5'>Enter your OTP</Typography>
      <Typography>Code is sent to {phoneNumber}</Typography>
      <img height="100px" src={otpImg} alt="logo" />
      <div>
        <OtpInput
          value={otp}
          onChange={(otp: string) => setOtp(otp)}
          numInputs={6}
          inputStyle={{
            width: "30px",
            height: "30px",
            margin: "0 8px",
            fontSize: "15px",
            borderRadius: 4,
            border: "0px",
            backgroundColor: "#EEEEEE"
          }}
          isInputNum
          hasErrored={Boolean(error)}
          errorStyle={{
            border: "1px solid red"
          }}
        />
        {error && <Typography color="red" variant='caption'>Incorrect otp! Please enter correct OTP</Typography>}
      </div>
      <div onClick={() => console.log("resend")}><Typography color="Highlight" variant='caption'>Resend OTP?</Typography></div>
      <Button variant='contained' onClick={() => otp && verifyOtp(otp)}>Verify</Button>
    </div>
  )
}