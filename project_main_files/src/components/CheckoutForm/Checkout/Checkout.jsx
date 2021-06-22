//This is the file where we are creating the CHECKOUT
import React, { useState, useEffect } from 'react'
//Imports that will extremely help us create the checkout
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { classExpression } from '@babel/types';
//Importing our styles we have created
import useStyles from './styles';
//Importing the AdressForm and the PaymentForm from the CheckoutForm folder
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
//Importing commerce so we can create a checkout token
import { commerce } from '../../../lib/commerce'
import { Link, useHistory } from 'react-router-dom';


const steps = ['Endereço de entrega', 'Detalhes de Pagamento']

//Passing cart as a prop here because we need the cart to generate a checkout token
//We have to pass the whole order as props as well, so we can finish the checkout
//We also have to pass the onCaptureCheckout, so we run the function that finishes the checkout
//And also pass the error message so we can have a meaningful feedback for the user about what is the error
const Checkout = ({ cart, order, onCaptureCheckout, errorMessage }) => {
    //Creating a constant called classes that has all the style propreties we created in the 'styles.js' file
    const classes = useStyles();
    //Creating our useState to move the stepper
    const [activeStep, setActiveStep] = useState(0);
    //Creating the state for the token
    const [checkoutToken, setCheckoutToken] = useState(null);
    //Creating the shipping data state
    const [shippingData, setShippingData] = useState({});

    //This function will add one state further to our steps in the checkout process
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    //This function will subtract one state from our steps in the checkout process
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    //Creating our checkout token
    useEffect(() => {
        //This is the function that generates the token itself
        const generateToken = async() => {
            try{
                // Generating our checkout token for this specific cart id session
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                //console.log(token);
                setCheckoutToken(token);
            } catch(error) {

            }
        }

        //Here we are calling the function so the token can be generated
        generateToken();

    }, [cart]);//This cart at the end indicates that we have to generate another token for each time the cart updates



    //This function down here will retrieve all the data information from the AdressForm.jsx
    const next = (data) => {
        setShippingData(data);
        // console.log(data);
        nextStep();
    };


    //This is the order confirmation step, where we thanks the customer and show some order info
    let Confirmation = () => (order.customer ? (
      <>
        <div>
          {/* Thanking the customer */}
          <Typography variant="h5">Obrigado por sua compra, {order.customer.firstname} {order.customer.lastname}!</Typography>
          {/* Divider to make a division on the div */}
          <Divider className={classes.divider} />
          {/* Order Reference */}
          <Typography variant="subtitle2">Número do Pedido: {order.customer_reference}</Typography>
        </div>
        <br />
        {/* Button to go back to the Home Page */}
        <Button component={Link} variant="outlined" type="button" to="/">Home</Button>
      </>
    ) : (
      // This is the spinning circle symbolizing the loading, until the info has been loaded
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    ));

    
    // If we have any error messages, we will display it
    if (errorMessage) {
      Confirmation = () => (
        <>
          {/* Text displaying what is the error */}
          <Typography variant="h5">Error: {errorMessage}</Typography>
          <br />
          <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
      );
    }

    //Checking wich form will be displayed based on wich step we are currently in
    const Form = () => (activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} next={next}/>
        //Passing the shipping data retrieved from the adress form so we can use this information in the payment form
        : <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} />);


    return (
        <>
            <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    {/* Title for checkout */}
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    {/* This will display out stepper, with different pages as we go through the
                    checkout steps */}
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {/* Looping through the steps so we can display each step at a time */}
                        {steps.map((step) => (
                            <Step key={step}>
                                {/* This is the label for the step we are currently in */}
                                <StepLabel>
                                    {step}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {/* Here we are checking if we are on the last step (if active step === last step) 
                    if we are not on the last step, we render <Form />>, that checks wich step we are in
                    and displays the form we need to be displayed*/}
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                                                                    {/* This "checkoutToken && <Form />" here tells React
                                                                    that the page will only render if we already have the token  */}
                </Paper>
            </main>
        </>
    )
}

export default Checkout;
