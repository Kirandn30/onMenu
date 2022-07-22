import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import InputField from '../input-field/input-field'
import { RootState } from '../redux/store/store'
import { BottomNav } from './bottomNav'

type Props = {}

export const Payment = (props: Props) => {

    const { shopId } = useParams()
    const { totalAmount } = useSelector((state: RootState) => state.appSlice)
    const [orderSuccess, setOrderSuccess] = useState<any>(null);

    useEffect(()=>{
        setTimeout(()=>{
            setOrderSuccess(null) 
        }, 5000)
    }, [orderSuccess])

    const [prefill, setPrefill] = useState<any>({
        name: "CJ",
        email: "abc@mail.com",
        contact: "7899554466",
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
            handler: function (response: any) {
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
                    // timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    ...prefill,
                    shopId: shopId,
                }

                // firestore.collection('payment').add(result)

                setPrefill({
                    amount: '',
                })
            },
            prefill: prefill,
            description: "payment to restaurant",
            name: "shop Name",
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
                //   timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
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

            <Button style={{ margin: "10px"}} variant='contained' onClick={loadRazorpay}>Pay Now</Button>

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