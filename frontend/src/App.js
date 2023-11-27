import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect, useState } from 'react'
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';
import Login from './components/user/Login'
import Register from './components/user/Register'
import {loadUser} from './actions/userActions'
import store from './store'
import Profile from './components/user/Profile'
import ProtectedRoute from './components/route/ProtectedRoute'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword'
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import axios from 'axios'


//payment
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(loadUser())
    async function getStripeApiKey() {
      const {data } = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }

    getStripeApiKey();
  }, [])
  return (
    <Router>
      <div className="App">
        <Header />
        <div className = "container container-fluid">
            <Routes>
              <Route path="/" element={<Home />} exact/>
              <Route path="/search/:keyword" element={<Home />}/>
              <Route path="/product/:id" element={<ProductDetails/>} exact/>
              <Route path="/login" element={<Login/>} exact/>
              <Route path="/register" element={<Register/>} exact/>
              <Route path="/password/forgot" element={<ForgotPassword/>} exact/>
              <Route path="/cart" element={<Cart />} exact/>
              <Route path="/shipping" element={<ProtectedRoute component={Shipping} />} />
              <Route path="/order/confirm" element={<ProtectedRoute component={ConfirmOrder} />} />

              <Route 
                    path="/payment"
                    element={(
                        stripeApiKey && <Elements stripe={loadStripe(stripeApiKey)}>
                          <ProtectedRoute component={Payment} />
                        </Elements>
                      )}/>
  

              <Route path="/me" element={<ProtectedRoute component={Profile} />} />
              <Route path="/me/update" exact element={ <ProtectedRoute component={UpdateProfile}/>} />
              <Route path="/password/update" exact element={ <ProtectedRoute component={UpdatePassword}/>} />

            </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
