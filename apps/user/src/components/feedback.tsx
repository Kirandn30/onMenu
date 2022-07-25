import { Button, IconContainerProps, Rating, styled, Typography } from '@mui/material'
import React, { useState } from 'react'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import InputField from '../input-field/input-field';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { BottomNav } from './bottomNav';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { db } from '../configs/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { setSelectedBranch } from '../redux/appSlice';

type Props = {}

const schema = yup.object({
    feedback: yup.string().required("Please enter the feedback")
})

export const Feedback = (props: Props) => {

    const navigate = useNavigate()
    const { shopId } = useParams()
    const { user } = useSelector((state: RootState) => state.User)
    const { selectedBranch } = useSelector((state: RootState) => state.appSlice)
    const [experienceRating, setExperienceRating] = useState<number>()
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

    const onsubmit = (data: any) => {
        console.log({
            ...data,
            experienceRating
        });

        if (!experienceRating) {
            setError("rating", { message: "Please select one", type: 'required' })
            return
        } else {
            clearErrors("rating")
        }

        addFeedback(data)
    }

    async function addFeedback(feedback: any) {
        if (shopId) {
            const docRef = await addDoc(collection(db, "shops", shopId, "feedbacks"), {
                ...feedback,
                name: user?.displayName,
                phoneNumber: user?.phoneNumber,
                experienceRating,
                timeStamp: serverTimestamp(),
            })
            console.log("Document written with ID: ", docRef.id);
            navigate(`/${shopId}/${selectedBranch?.id}`)
        }
    }

    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
            color: theme.palette.action.disabled,
        },
    }));

    const customIcons: {
        [index: string]: {
            icon: React.ReactElement;
            label: string;
        };
    } = {
        1: {
            icon: <SentimentVeryDissatisfiedIcon color="error" />,
            label: 'Very Dissatisfied',
        },
        2: {
            icon: <SentimentDissatisfiedIcon color="error" />,
            label: 'Dissatisfied',
        },
        3: {
            icon: <SentimentSatisfiedIcon color="warning" />,
            label: 'Neutral',
        },
        4: {
            icon: <SentimentSatisfiedAltIcon color="success" />,
            label: 'Satisfied',
        },
        5: {
            icon: <SentimentVerySatisfiedIcon color="success" />,
            label: 'Very Satisfied',
        },
    };

    function IconContainer(props: IconContainerProps) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    return (
        <div>
            <Typography variant='h4'>How was your experience with us!</Typography>

            <form onSubmit={handleSubmit(onsubmit)}>

                <Typography variant='body1'>Please rate your experience</Typography>
                <StyledRating
                    name="highlight-selected-only"
                    // defaultValue={4}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value: number) => customIcons[value].label}
                    value={experienceRating}
                    onChange={(e, v) => { if (v) setExperienceRating(v) }}
                    highlightSelectedOnly
                />

                <Typography color={'error'} >
                    {errors['rating']?.message}
                </Typography>

                <InputField placeholder='Please write your feedback'
                    fullWidth multiline rows={3}
                    forminput={{ ...register("feedback") }}
                // helperText={errors['menuName']?.message}
                // error={Boolean(errors['menuName'])}
                />

                <Button type='submit'>Submit</Button>

            </form>

            <BottomNav />
        </div>
    )

}