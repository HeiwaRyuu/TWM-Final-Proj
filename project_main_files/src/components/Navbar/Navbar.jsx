//This is the file where we create our NAVIGATION BAR
import React from 'react';
//Imports to make the navbar fully mobile responsive and add some features to it
//The IconButton here is another icon to represent our shopping cart
//The Badge here represents a notification showing how many items we have in the cart
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
//This is our shopping car icon
import { ShoppingCart } from '@material-ui/icons';
import { classExpression } from '@babel/types';
//Our own Logo Mark
import logo from '../../assets/DDT_LOGO.jpg'
//Importing our styles we have created
import useStyles from './styles';
//Importing the Link so we can navigate between pages and useLocation so we can know 
// wich page we are currently at
import { Link, useLocation } from 'react-router-dom';


//totalItems is the props containing the amount of items currently into the cart
const Navbar = ({ totalItems }) => {
    //Creating a constant called classes that has all the style propreties we created in the 'styles.js' file
    const classes = useStyles();
    //Defining the hook for the current location
    const location = useLocation();

    return (
        <>
            {/* This AppBar component, is basically a navigation bar */}
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    {/* This is the typography for our logo and our brand 
                    This is going to appear on the left side of the navbar*/}
                    {/* This component={Link} makes this Typography behave like a link, and the 'to="/"'
                        is the path we are going to be taken to when we click this button, in this case
                        back to the home page, where the items are being displayed */}
                    <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit" style={{ textDecoration: 'none' }}>
                        {/* Logo image */}
                        <img src={logo} alt="Periféricos PV" height="25px" className={classes.image} />
                        {/* Company Name */}
                        Periféricos PV
                    </Typography>
                    {/* This is a div thats going to show up in the middle of the nav bar, taking as much space as needed */}
                    <div className={classes.grow} />
                    {location.pathname == '/' && (
                        /* This is going to show up in the right side of the div */
                        <div className={classes.button}>
                            {/* This is the button that the user clicks on and gets redirected to the cart page */}
                            {/* This component={Link} makes this button behave like a link, and the 'to="/cart"'
                            is the path we are going to be taken to when we click this button */}
                            <IconButton component={Link} to="/cart" aria-label="Mostrar itens no carrinho" color="inherit">
                                {/* This is the badge showing how many items are inside the cart */}
                                <Badge badgeContent={totalItems} color="secondary">
                                    {/* This is our shopping cart icon */}
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </div>)}
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar;
