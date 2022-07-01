import React, { useState } from 'react'
import { useEmailPassword } from '../../hooks/emailPassword'
import { app } from "../../config/firebase"
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/auth'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../ui-components/Input'
import { Button, Checkbox, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type Inputs = {
    email: string,
    password: string,
};

const schema = yup.object({
    email: yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: yup.string().required("Password is required").max(16, 'Password must not exceed 8 characters').matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
})

export const SignUp = () => {

    const { signUp } = useEmailPassword({ app })
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
        resolver: yupResolver(schema)
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <form onSubmit={handleSubmit((data) => { signUp(data.email, data.password); dispatch(setLoading(true)) })}>
            <div id='card'>
                <Typography variant='h6'>Please enter your username and password</Typography>
                <InputField type="text" placeholder='Email' error={Boolean(errors.email)} helperText={errors.email?.message} name="email" fullWidth forminput={{ ...register("email") }} />
                <div style={{ textAlign: "center" }}>
                    <InputField type={showPassword ? "text" : "password"} placeholder='Password' error={Boolean(errors.password)} helperText={errors.password?.message} name='password' fullWidth forminput={{ ...register("password") }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>
                            <Checkbox size='small' onChange={() => setShowPassword(!showPassword)} />
                            <Typography variant='caption'>Show password</Typography>
                        </span>
                    </div>
                    <Button fullWidth type='submit' variant='contained'>Sign up</Button>
                    <Typography style={{ marginTop: "10px" }} variant='subtitle2'>Already have a accont <strong onClick={() => navigate("/")} style={{ color: "#2196f3", cursor: "pointer" }}>Login</strong></Typography>
                </div>
            </div >
        </form>
    )
}
