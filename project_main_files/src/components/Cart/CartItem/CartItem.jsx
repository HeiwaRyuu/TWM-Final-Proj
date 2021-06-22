//This file will contain the definition for the CART ITEM object
import React from 'react';
//Some imports to help out on the cart item construction
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';
//Importing our styles we have created
import useStyles from './styles';


//Receiving the item as a prop so we can use its propreties
//onUpdateCartQty is the function that updates the cart quantity, adding up or down the number of items
//onRemoveFromCart is the function that removes an item from the cart when click
const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {

  //Creating a constant called classes that has all the style propreties we created in the 'styles.js' file
  const classes = useStyles();

  const handleUpdateCartQty = (lineItemId, newQuantity) => onUpdateCartQty(lineItemId, newQuantity);

  const handleRemoveFromCart = (lineItemId) => onRemoveFromCart(lineItemId);

  return (
    <Card className="cart-item">
      {/* Displaying the item image */}
      <CardMedia image={item.media.source} alt={item.name} className={classes.media} />
      <CardContent className={classes.cardContent}>
        {/* Displaying the item name */}
        <Typography variant="h5">{item.name}</Typography>
        {/* Displaying the item price */}
        <Typography variant="h6">{item.line_total.formatted_with_symbol}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        {/* Container displaying the "-", "+" and "quantity" for each specific item */}
        <div className={classes.buttons}>
          {/* Button to decrement one unit of that item in the cart */}
          <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}>-</Button>
          {/* Displaying the amount of that specific item contained in the cart */}
          <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
          {/* Button to add another of the same item to the cart */}
          <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}>+</Button>
        </div>
        {/* Button that removes item from cart */}
        <Button variant="contained" type="button" color="secondary" onClick={() => handleRemoveFromCart(item.id)}>Remover Item</Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
