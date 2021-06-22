//This page is returning a general list of all the things we have purchased up to now
import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

//Passing the checkout token as a props so we can have the information about all the items inside the cart
const Review = ({ checkoutToken }) => (
  <>
    {/* This Typography is for the title "Order summary" */}
    <Typography variant="h6" gutterBottom>Resumo do Pedido</Typography>
    <List disablePadding>
      {/* Because we have access to the checkout token, we can loop through all the items inside the cart */}
      {checkoutToken.live.line_items.map((product) => (
        //   Here we are displaying each item info as JSX
        <ListItem style={{ padding: '10px 0' }} key={product.name}>
          {/* Displaying the name and the quantity of that specific product */}
          <ListItemText primary={product.name} secondary={`Quantidade: ${product.quantity}`} />
          {/* Displaying the formatted price */}
          <Typography variant="body2">{product.line_total.formatted_with_symbol}</Typography>
        </ListItem>
      ))}
      {/* Displaying the total cost for all the items inside the cart */}
      <ListItem style={{ padding: '10px 0' }}>
        <ListItemText primary="Total" />
        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
          {checkoutToken.live.subtotal.formatted_with_symbol}
        </Typography>
      </ListItem>
    </List>
  </>
);

export default Review;
