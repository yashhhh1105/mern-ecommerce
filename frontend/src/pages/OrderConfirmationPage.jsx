import React from 'react'

const checkout={
    _id:"12323",
    createdAt: new Date(),
    checkoutItems :[
        {
            productId: "1",
            name:"Jacket",
            color:"black",
            size:"M",
            price: 150,
            quantity:1,
            image:"https://picsum.photos/200/300?random=1"
        },
        {
            productId: "2",
            name:"Tshirt",
            color:"black",
            size:"M",
            price: 120,
            quantity:2,
            image:"https://picsum.photos/200/300?random=2"
        },
    ],
    shippingAddress:{
        address: "123 Fashion Street",
        city:"New York",
        country:"USA",
    },
};

const OrderConfirmationPage = () => {

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate()+10);//Add 10 days to the order date
        return orderDate.toLocaleDateString();
    }
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
        <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
            Thank you for your order!
        </h1>

        {checkout && (
            <div className='p-6 rounded-lg border'>
                <div className='flex justify-between mb-20'>
                    {/* Orer ID and Date */}
                    <div>
                        <h2 className='text-xl font-semibold'>
                            Order Id:{checkout._id}
                        </h2>
                        <p className='text-gray-500'>
                            Order date:{new Date(checkout.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className='text-emerald-700 text-sm'>
                            Estimated Delivery:{""}
                            {calculateEstimatedDelivery (checkout.createdAt)}
                        </p>
                    </div>
                </div>
                {/* Ordered Items */}
                <div className='mb-20'>
                    {checkout.checkoutItems.map((items) => (
                        <div key={items.products} className='flex items-center mb-4'>
                            <img src={items.image} alt={items.name}
                            className='w-16 h-16 object-cover rounded-md mr-4' />
                            <div>
                                <h4 className='text-md font-semibold'>{items.name}</h4>
                                <p className='text-sm text-gray-500'>
                                    {items.color} | {items.size}
                                </p>
                            </div>
                            <div className='ml-auto text-right'>
                                <p className='text-md'>${items.price}</p>
                                <p className='text-sm text-gray-500'>Qty: {items.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Payment and Delivery Info */}
                <div className='grid grid-cols-2 gap-8'>
                    {/* Payment Info */}
                    <div>
                        <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                        <p className='text-gray-600'>PayPal</p>
                    </div>
                    {/* Delivery Info */}
                    <div>
                        <h4 className='text-lg font-semibold mb-2 '>Delivery</h4>
                        <p className='text-gray-600'>
                            {checkout.shippingAddress.address}
                        </p>
                        <p className='text-gray-600'>
                            {checkout.shippingAddress.city},{" "}
                            {checkout.shippingAddress.country}
                        </p>
                    </div>
                </div>
            </div>   
        )}
    </div>
  )
}

export default OrderConfirmationPage
