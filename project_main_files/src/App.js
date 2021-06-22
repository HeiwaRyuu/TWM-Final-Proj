import React, { useState, useEffect } from "react"
//Importing all the objects we have created from the 'index.js' file inside
// the 'components' folder
import { Products, Navbar, Cart , Checkout} from './components'
//Importing our instance of our store
import { commerce } from './lib/commerce'
//Imports needed to make the REACTROUTER
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

const App = () => {
  //Creating our new states
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  //Creating the order state
  const [order, setOrder] = useState({});
  //Creating the state for the error message
  const [errorMessage, setErrorMessage] = useState('');

  //PRODUCTS
  //Creating the function that is going to fetch the products
  //Using async function is the same thing of using ".then and .catch", but with simpler
  // and cleaner code, and resembles way more synchronous code
  const fetchProducts = async () => {
    //We are going to await the API call to our commerce instance, and then get the data
    // from the call response
    const { data } = await commerce.products.list();

    //Populating the "products"
    setProducts(data);
  }


  //CART
  //Creating the function that is going to fetch the cart
  //Using async function is the same thing of using ".then and .catch", but with simpler
  // and cleaner code, and resembles way more synchronous code
  const fetchCart = async () => {
    //We are going to await the API call to our commerce instance, and then get the data
    // from the call response
    const  cart = await commerce.cart.retrieve();

    //Setting cart to the state
    setCart(cart);
  }


  //ADD TO CART
  //We will use this function inside the Product page, where we are going to use the button to increment
  // the item quantity
  const handleAddToCart = async(productId, quantity) => {
    const { cart } = await commerce.cart.add(productId, quantity);

    //This is the cart after the item has been added
    setCart(cart);
  }



  //UPDATE CART QUANTITY
  //We will use this function inside the Cart page to update the item quantity
  const handleUpdateCartQty = async(productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });

    //This is the cart after the item quantity has been updated
    setCart(cart);
  }


  //REMOVE FROM CART
  //We will use this function inside the Cart page to remove an item from cart
  const handleRemoveFromCart = async(productId) => {
    const { cart } = await commerce.cart.remove(productId);

    //This is the cart after the item has been removed
    setCart(cart);
  }


  //EMPTY ENTIRE CART
  //We will use this function inside the Cart page to empty the cart
  const handleEmptyCart = async() => {
    const { cart } = await commerce.cart.empty();

    //This is the cart after it has been emptied
    setCart(cart);
  }


  //REFRESHING CART
  //This function refreshes the cart after the order has been fetched
  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  //HANDLING THE CHECKOUT
  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    // Here we are trying to fetch the incoming order
    try {
      //Getting the order
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

      //Once we have the order we are going to set it to the state
      setOrder(incomingOrder);

      refreshCart();
    } 
    //If we have any kind of error, these errors will be displayed with meaningful information
    catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  //Fetching Products and Cart
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);


  //This use effect has its dependency array set to empty, so it only runs at the start (on the render)
  //This is called a "COMPONENT THAT MOUNT" in class based components
  useEffect(() => {
    //This is calling our commerce product list and set the products to the state
    fetchProducts();
    //This is going to fetch our cart
    fetchCart();
  }, []);


  //Test for PRODUCTS
  //console.log(products);
  //Test for CART
  //console.log(cart);

  return (
    <Router>
      <div>
        {/* This will display our Navigation Bar */}
        {/* cart.total_items is the property that contains how many items we have
        currently in the cart */}
        {/* This always shows in both routes */}
        <Navbar totalItems={cart.total_items}/>
        <Switch>
          {/* ITEMS PAGE ROUTE */}
          <Route exact path="/">
             {/* This will display all of our products 
            This handleAddToCart is the function that will add the item to the cart*/}
            <Products products={ products } onAddToCart={handleAddToCart}/>
          </Route>
          {/* CART PAGE ROUTE */}
          <Route exact path="/cart">
            {/* This will display our cart page, either with "no items in cart" or with all the items added to the cart */}
            <Cart 
              cart={cart} 
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveFromCart={handleRemoveFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>
          <Route exact path="/checkout">
            {/* Passing the cart as a prop so we can have access to the cart inside the checkout
            so we will be able to create a token, because we need the cart to create the token */}
            <Checkout 
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
