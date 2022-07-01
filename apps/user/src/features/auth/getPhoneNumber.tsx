// import React from 'react'
// import InputField from '../../UI/input-field/input-field'
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup'
// import { Button } from '@mui/material';

// const schema = yup.object().shape({
//     phone:yup.number().typeError('enter only numbers').positive('cannot contain special characters').integer('cannot contain special characters').min(6000000000,'enter valid phone number').max(9999999999,'enter valid phone number').required('phone number is required')
//   })

// type Props = {
//     sendOtp:(phone:string)=>void,
// }

// export default function GetPhoneNumber({sendOtp}: Props) {
//     const { register, formState:{errors}, handleSubmit } = useForm({resolver:yupResolver(schema)})
//   return (
//     <form onSubmit={handleSubmit(data=>sendOtp(`+91${data['phone']}`))} >
//     <InputField error={Boolean(errors['phone'])} helperText={errors['phone']?.message} forminput={{...register('phone')}} />
//     <Button
//     type='submit'
//     >
//       get otp
//     </Button>
//   </form>
//   )
// }


import React from 'react'
import { Button, Typography } from "@mui/material";
import logo from "../../assets/images/logo.png"
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../input-field/input-field';

type Inputs = {
  fullName: string,
  phoneNumber: number,
};

const schema = yup.object().shape({
  fullName: yup.string().min(3, "minimum of 3 characters required").required("name cannot be empty"),
  phoneNumber: yup.number().typeError('enter only numbers').positive('cannot contain special characters').integer('cannot contain special characters').min(6000000000, 'enter valid phone number').max(9999999999, 'enter valid phone number').required('phone number is required')
})

type Props = {
  sendOtp: (phone: string) => void,
}

export const GetPhoneNumber = ({ sendOtp }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: Inputs) => {
    sendOtp(`+91${data.phoneNumber}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <div id='card' style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
        <img src={logo} alt="logo" />
        <Typography variant="h6">Hey there! care to provide some details</Typography>
        <div style={{ display: "grid", gap: "30px" }}>
          <InputField
            placeholder="Full Name"
            forminput={{ ...register("fullName") }}
            error={Boolean(errors['fullName'])}
            helperText={errors['fullName']?.message}
          />
          <InputField
            placeholder="Mobile number"
            forminput={{ ...register("phoneNumber") }}
            error={Boolean(errors['phoneNumber'])}
            helperText={errors['phoneNumber']?.message}
          />
        </div>
        <Button type='submit' variant="contained" >Login</Button>
      </div>
    </form >
  )
}
