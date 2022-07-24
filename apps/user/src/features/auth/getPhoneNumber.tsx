import { Button, Typography } from "@mui/material";
import logo from "../../assets/images/logo.png"
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../input-field/input-field';
import { useDispatch } from "react-redux";
import { setName } from "../../redux/authSlice";

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
  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: Inputs) => {
    dispatch(setName(data.fullName))   //line is added to get username
    // dispatch(setName(data.phoneNumber))
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
