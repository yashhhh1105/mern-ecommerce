import React from 'react'
import {PayPalButtons,  PayPalScriptProvider} from "@paypal/react-paypal-js";
const PayPalButton = ({amount,onSuccess,onError}) => {

    console.log(import.meta.env.VITE_PAYPAL_CLIENT_ID);

  return (
    <PayPalScriptProvider options={{"client-id":
        import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency:"USD"
    }}>
        <PayPalButtons 
        style={{layout:"vertical"}}
        createOrder={(data,actions) => {

            console.log("Creating order for:", amount);

            return actions.order.create({

                purchase_units: [
                    {
                        amount:{
                            currency_code:"USD",
                            value:parseFloat(amount).toFixed(2)
                        },
                    },
                ],
            }).then((orderID) => {
        console.log("Order ID:", orderID);
        return orderID;
            });
        }}
        onApprove={(data,actions) => {
            return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
        />
    </PayPalScriptProvider>
  )
}

export default PayPalButton
