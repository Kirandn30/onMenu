import React, { useState } from 'react'
import { useEmailPassword } from '../../hooks/emailPassword'
import { app } from "../../config/firebase"
import { Button, Checkbox, TextField, Typography } from '@mui/material'
import { useForm } from "react-hook-form";
import InputField from '../../ui-components/Input';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { setLoading } from '../../redux/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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

export const Login = () => {
    const { signIn, resetPassword } = useEmailPassword({ app })
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
        resolver: yupResolver(schema)
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [show, setShow] = useState<"login" | "forgot">("login")
    const [email, setEmail] = useState<null | string>(null)

    return (
        <form onSubmit={handleSubmit((data) => { signIn(data.email, data.password); dispatch(setLoading(true)) })}>
            {show === "login" ? (
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
                            <span onClick={() => setShow("forgot")}><Typography color="#2196f3" variant='subtitle2' style={{ marginTop: "8px", cursor: "pointer" }}>Forgot Password?</Typography></span>
                        </div>
                        <Button fullWidth type='submit' variant='contained'>Log in</Button>
                        <Typography style={{ marginTop: "10px" }} variant='subtitle2'>Don't have a accont <strong onClick={() => navigate("/register")} style={{ color: "#2196f3", cursor: "pointer" }}>SignUp</strong></Typography>
                    </div>
                </div >
            ) : (
                <div id='card'>
                    <Typography variant='h6'>Please enter your Email</Typography>
                    <InputField onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' error={Boolean(errors.email)} helperText={errors.email?.message} name="email" fullWidth forminput={{ ...register("email") }} />
                    <Button fullWidth type='submit' variant='contained' onClick={() => { email && resetPassword(email); setShow("login") }}>send rest mail</Button>
                </div>
            )}
        </form>
    )
}
