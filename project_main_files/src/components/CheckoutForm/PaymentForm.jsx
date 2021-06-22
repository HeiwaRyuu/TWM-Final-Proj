//This is the page we are going to create the PAYMENT FORM
import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


//This is basically a general list of all the things we have purchased
import Review from './Review';


//Here we have an instance of our loadStripe, where we need to pass our stripe public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


//This is the final function that is going to finalize the order
const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {
  const handleSubmit = async (event, elements, stripe) => {

    //This will prevent our website to refresh after we click the submit button
    event.preventDefault();


    //Here we have some error handling
    //First, if we have no "stripe" OR if we have no "elements" we are going to return nothing
    if (!stripe || !elements) return;


    //Here we are getting our element
    const cardElement = elements.getElement(CardElement);

    //Here we start creating our payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    //If we have the error from the response above we will console.log the error
    if (error) {
      console.log('[error]', error);
    } 
    // If there is no error, we are going to create one final element, containing all of the 
    // purchase information, username, adress, products, price, etc...
    else {
      //   This variable "orderData" will contain all of the purchase information
      const orderData = {
        // RETRIEVING LIST ITEMS
        line_items: checkoutToken.live.line_items,
        // CUSTOMER
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        // SHIPPING OPTIONS
        shipping: { name: 'Internacional', street: shippingData.address1, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
        // SHIPPIG METHOD
        fulfillment: { shipping_method: shippingData.shippingOption },
        // PAYMENT METHOD
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };

      onCaptureCheckout(checkoutToken.id, orderData);

      //Going to the next payment step (conclusion)
      nextStep();
    }
  };

  return (
    <>
    {/* This review is an instance of the object we created to show all the info from the purchased items */}
      <Review checkoutToken={checkoutToken} />
      {/* This divider is just a border to give an impression for a division in the payment method */}
      <Divider />
      {/* This is the title for choosing the payment method */}
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Tipo de Pagamento</Typography>
      {/* This elements are directly from stripe */}
      <Elements stripe={stripePromise}>
        {/* Here we pass as props "elements" that we are going to use for the payment, and the stripe */}
        <ElementsConsumer>{({ elements, stripe }) => (
          // Here we start creating our form where the user will input the information
          //Down here we pass 3 parameters, the event of the click, the elements and then finally, stripe
          <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
            <CardElement />
            <br /> <br />
            {/* Display for the buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* This button returns one step back into the checkout process */}
              <Button variant="outlined" onClick={backStep}>Retornar</Button>
              {/* This button is for the final submit of payment, and this will be disabled if 
              we have no acces to the stripe information */}
              <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                {/* This is going to display the total amount that needs to be payed to complete the purchase */}
                Finalizar Pagamento {checkoutToken.live.subtotal.formatted_with_symbol}
              </Button>
            </div>
          </form>
        )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
