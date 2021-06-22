//This is the file where we are going to create the CHECKOUT ADRESS FORM
import React, { useState, useEffect } from 'react';
//This are some key imports to help build out the form
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
//Importing commerce so we can fetch all the data for the shipping from what we selected there
import { commerce } from '../../lib/commerce';
//Inputting our FormInput (this custom input will make our lives easier)
import FormInput from './CustomTextField';


//Passing the checkout token as a props so we can keep on the checkout session
//Passing the next as a props so we can get the information we are moving to the next step in the chekcout process
const AddressForm = ({ checkoutToken, next }) => {

  //These are all the use states we use to update the fields
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  //This will give us all the methods we need to run our form
  const methods = useForm();


  //FETCHING SHIPPING COUNTRIES
  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[3]);
  };


  //FETCHING SHIPPING DIVISIONS
  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };


  //FETCHING SHIPPING OPTIONS
  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

    setShippingOptions(options);
    setShippingOption(options[0].id);
  };


  //Here we call the fetchShippingCountries to populate the country field and then start the cascade to populate the rest
  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);
  //Whenever the shipping country changes, we have to call fetchSubdivisions that has a dependency in the fetchShippingCountries
  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);
  //Whenever the shipping subdivision changes, we have to call fetchShippingOptions that has a dependency in the shippingSubdivision
  useEffect(() => {
    if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);



  return (
    <>
    {/* Shipping Adress Label */}
      <Typography variant="h6" gutterBottom>Informações para Entrega</Typography>
      {/* This "...methods" is spreading all the methods from react-hook-form */}
      <FormProvider {...methods}>
        {/* Creating the form itself */}
        {/* This special handleSubmit function will contain all the data from the input fields
        and then we are going to send all this data back to the Checkout session */}
        <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
          {/* This is our grip containing all the input fields used in this first part */}
          <Grid container spacing={3}>
            <FormInput required name="firstName" label="Nome" />
            <FormInput required name="lastName" label="Sobrenome" />
            <FormInput required name="address1" label="Endereço" />
            <FormInput required name="email" label="Email" />
            <FormInput required name="city" label="Cidade" />
            <FormInput required name="zip" label="CEP" />
            {/* Grid for the select inputs */}
            <Grid item xs={12} sm={6}>
              <InputLabel>País de Entrega</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {/* //Getting all the countries in one simple array
                //This Object.entries convertes from an object into a 2D array
                //and then we map over it once again to cenvert it into a 1D array, getting the code and the name */}
                {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Estado</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                {/* //Getting all the subdivisions in one simple array
                //This Object.entries convertes from an object into a 2D array
                //and then we map over it once again to cenvert it into a 1D array, getting the code and the name */}
                {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Tipo de Envio</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {/* As shipping options are not an array by default, we don't need to get Object.entries, because
                it is alrady an array with only one element and the shipping data that we have to access */}
                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} variant="outlined" to="/cart">Retornar ao Carrinho</Button>
            <Button type="submit" variant="contained" color="primary">Próximo</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
