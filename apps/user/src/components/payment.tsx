import { Button } from '@mui/material'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { db } from '../configs/firebaseConfig'
import InputField from '../input-field/input-field'
import { addToCart } from '../redux/appSlice'
import { RootState } from '../redux/store/store'
import { BottomNav } from './bottomNav'

type Props = {}

export const Payment = (props: Props) => {

    const dispatch = useDispatch()
    const { shopId } = useParams()
    const { user } = useSelector((state: RootState) => state.User)
    const { selectedBranch, totalAmount } = useSelector((state: RootState) => state.appSlice)
    const [orderSuccess, setOrderSuccess] = useState<any>(null);

    useEffect(() => {
        setTimeout(() => {
            setOrderSuccess(null)
        }, 5000)
    }, [orderSuccess])

    const [prefill, setPrefill] = useState<any>({
        name: user?.displayName,
        contact: user?.phoneNumber,
        amount: totalAmount ? totalAmount : '',
    })

    const paymentResult = {
        by: 'Razorpay',
    }

    async function loadRazorpay() {
        // if (prefill.amount === "" && !takeawayMode) {
        //     setError("cannot have empty amount");
        //     return;
        //   }
        //   // if (!emailRegex.test(prefill.email)) {
        //   //   setError("must be an email");
        //   //   return;
        //   // }
        //   if (!amountRegex.test(prefill.amount) && !takeawayMode) {
        //     setError("not valid amount");
        //     return;
        //   }
        const options: any = {
            key: "rzp_test_fY8QF3EzxnyDs7",
            handler: async function (response: any) {
                // success function
                setOrderSuccess({
                    status: 'success',
                    id: response.razorpay_payment_id,
                    by: 'Razorpay',
                    paymentStatus: 'Success',
                    amount: prefill.amount
                })
                var result = {
                    ...paymentResult,
                    status: 'success',
                    paymentStatus: 'Success',
                    timeStamp: serverTimestamp(),
                    userId: user?.uid,
                    ...prefill,
                    shopId: shopId,
                    id: response.razorpay_payment_id
                }

                if (shopId) {
                    const docRef = await addDoc(collection(db, "shops", shopId, "payments"), result)
                    console.log("Document written with ID: ", docRef.id);
                }

                setPrefill({
                    amount: '',
                })

                dispatch(addToCart([]))
            },
            prefill: prefill,
            description: "payment to shop",
            name: selectedBranch? selectedBranch.branchName + " branch": "Shop name",
            "payment-capture": true,
            amount: parseFloat(prefill.amount) * 100,
        }

        await loadScript(`https://checkout.razorpay.com/v1/checkout.js`);
        const _window: any = window
        const paymentObject = _window.Razorpay(options);

        paymentObject.on("payment.failed", function (response: any) {
            var result = {
                ...paymentResult,
                ...prefill,
                ...response,
                ...response.metadata,
                status: 'failed',
                paymentStatus: 'failure',
                timeStamp: serverTimestamp(),
                shopId: shopId,
            }
            // firestore.collection('payment').add(result)
            //failure function
            setOrderSuccess({ status: "failed", by: "razorpay" });
        });
        paymentObject.open();
    }

    return (
        <div>
            <InputField placeholder='Enter the amount'
                value={prefill.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    setPrefill({ ...prefill, amount: e.target.value })} />

            <Button style={{ margin: "10px" }} variant='contained' onClick={loadRazorpay}>Pay Now</Button>

            {orderSuccess &&
                <div>
                    <p>{orderSuccess.status}</p>
                    <p>{orderSuccess.id}</p>
                    <p>{orderSuccess.amount}</p>
                </div>
            }

            <BottomNav />
        </div>
    )
}

export const loadScript = (src: any) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};