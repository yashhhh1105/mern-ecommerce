import React from 'react'
import {PayPalButtons,  PayPalScriptProvider} from "@paypal/react-paypal-js";
const PayPalButton = ({amount,onSuccess,onError}) => {
  return (
    <PayPalScriptProvider options={{"client-id":
        import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency:"USD"
    }}>
        <PayPalButtons 
        style={{layout:"vertical"}}
        createOrder={(data,actions) => {
            return actions.order.create({
                intent: "CAPTURE",

                purchase_units: [
                    {
                        amount:{
                            currency_code:"USD",
                            value:"100.00"
                        },
                    },
                ],
            });
        }}
        onApprove={(data,actions) => {
            return actions.order.capture().then(onSuccess)
        }}
        onError={onError}
        />
    </PayPalScriptProvider>
  )
}

export default PayPalButton
