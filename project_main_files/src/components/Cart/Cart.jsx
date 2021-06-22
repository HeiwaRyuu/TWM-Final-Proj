//This is the file where we define CART object
import React from 'react'
//Importing some classes that will help out on displaying the interactive
import { Container, Typography, Button, Grid, Divider } from '@material-ui/core';
//Importing our styles we have created
import useStyles from './styles';
//Importing our CartItem object
import CartItem from './CartItem/CartItem'
//Importing the Link so we can navigate between pages
import { Link } from 'react-router-dom';


//cart is the prop containing the cart state
//handleUpdateCartQty is the function that updates the quantity of an item inside the cart
//handleRemoveFromCart is the function that removes an item from the cart
//handleEmptyCart is the function that completely empties the cart
const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart }) => {
    //Creating a constant called classes that has all the style propreties we created in the 'styles.js' file
    const classes = useStyles();
    //These 2 functions bellow are regular functions that returns some JSX
    // that's why we can call these function like we did on the logic: isEmpty ? <EmptyCart /> : <FilledCart />
    //Defining what we are going to show if the cart is empty 
    const EmptyCart = () => (
        <Typography variant="subtitle1" className={classes.title}>
            Não há nenhum item em seu carrinho no momento.
            <Link to='/' className={classes.link} className={classes.title}>Vamos às compras!</Link>
        </Typography>
    );


    //Defining what we are going to show if the cart has items
    const FilledCart = () => (
        <>
        {/* This is showing the total value of the items inside the cart */}
        <Typography variant="h4" align="left" className={classes.title}>
            Total: { cart.subtotal.formatted_with_symbol }
        </Typography>
        <br></br>
        <Grid container spacing={3}>
            {/* Looping through all the items in the cart so we can display one by one */}
            {cart.line_items.map((item) => (
                // Defining once again how this is going to look on each screen size
                <Grid item xs={12} sm={4} key={item.id}>
                    {/* Displaying the CartItem for each respective item we are looping through */}
                    {/* We are also passing here the functions "handleUpdateCartQty" and "handleRemoveFromCart"
                    so we can use them insite the CartItems when we click it's buttons */}
                    <CartItem 
                        item={item}
                        onUpdateCartQty={handleUpdateCartQty}
                        onRemoveFromCart={handleRemoveFromCart}/>
                </Grid>
            ))}
        </Grid>
        <div className={classes.cardDetails}>
            <div>
                {/* This button will empty the cart */}
                <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>
                    Esvaziar o carrinho
                </Button>
                {/* This button will take the user to the checkout*/}
                <Button component={Link} to='/checkout' className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">
                    Checkout
                </Button>
            </div>
        </div>
        </>
    );


    //This is an error check, if no items were fetched, we will return a loading page
    if(!cart.line_items) return 'Loading...'


    return (
        //This container component is basically a div with some space and padding
        <Container>
            {/* Pushes the content a bit more down so does not overlap content */}
            <div className={classes.toolbar}/>
            {/* Title */}
            {/* gutterBottom makes so that it has a little bit of spacing from the top */}
            <Typography className={classes.title} variant="h4" gutterBottom color="primary">
                Seu Carrinho
            </Typography>
            {/* Logic to display different stuff based on wether the cart is empty or not */}
            {/* If the cart is empty, we will display an EmptyCart, if not, we will display the FilledCart */}
            { cart.line_items.length == 0 ? <EmptyCart /> : <FilledCart /> }
        </Container>
    )
}

export default Cart;
