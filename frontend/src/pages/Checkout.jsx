import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { delCart } from "../redux/action";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {

    const [userDetails, setUserDetails] = useState(null)

    useEffect(() => {
        fetchUserData()
    }, [setUserDetails])

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);
            if(user != null) {
                const docRef = doc(db, "Users", user.uid)
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    setUserDetails(docSnap.data());
                    console.log(docSnap.data()); 
                } else {
                    console.log("User not logged in");
                    setUserDetails(null)        
                }
            } else {
                setUserDetails(null)
            }
        })
    }

    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    const amount = Math.round(subtotal + shipping)
    
    state.map((item) => {
      return (totalItems += item.qty);
    });

    const removeItem = (product) => {
      dispatch(delCart(product));
    };

    const handlePayment = async (e) => {
      e.preventDefault();
      if(userDetails == null){
        toast.error("Please Log-in before checkout", {position: "top-center"})
      } else {
          try {
            const res = await fetch(`http://localhost:4000/api/payment/order`, {
                  method: "POST",
                  headers: {
                    "content-type": "application/json"
                  },
                  body: JSON.stringify({
                      amount
                  })
              });
              const data = await res.json();
              console.log(data);
              handlePaymentVerify(data.data)
          } catch (error) {
              console.log(error);
          }
      }
    }

    const handlePaymentVerify = async (data) => {
      const options = {
          key: "rzp_test_F2JLfZCsE7MDUw",
          amount: data.amount,
          currency: data.currency,
          name: "Ecommerce Website",
          description: "Test Mode",
          order_id: data.id,
          handler: async (response) => {
              console.log("response", response)
              try {
                  const res = await fetch(`http://localhost:4000/api/payment/verify`, {
                      method: 'POST',
                      headers: {
                          'content-type': 'application/json'
                      },
                      body: JSON.stringify({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                      })
                  })
                  console.log(res);
                  const verifyData = await res.json();
                  console.log("verify ",verifyData);
                  if (verifyData.message === "Payment Successfull") {
                      console.log("success");
                      toast.success("Payment Completed Successfully", {position: "top-center"})
                      state.map((item) => {
                        removeItem(item)
                      })
                      // Adding transaction data in firebase
                      await setDoc(doc(db, "Payments", response.razorpay_order_id), {
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                          amount: data.amount
                      })
                  }
              } catch (error) {
                  console.log(error);
              }
          },
          theme: {
              color: "#5f63b8"
          }
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
  }

    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>₹ {Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>₹ {shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>₹ {Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" novalidate onSubmit={handlePayment}>
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label for="firstName" className="form-label">
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Valid first name is required.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label for="lastName" className="form-label">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Valid last name is required.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label for="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="you@example.com"
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter a valid email address for shipping
                          updates.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label for="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="1234 Main St"
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your shipping address.
                        </div>
                      </div>

                      <div className="col-12">
                        <label for="address2" className="form-label">
                          Address 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          placeholder="Apartment or suite"
                        />
                      </div>

                      <div className="col-md-5 my-1">
                        <label for="country" className="form-label">
                          Country
                        </label>
                        <br />
                        <select className="form-select" id="country" required>
                          <option value="">Choose...</option>
                          <option>India</option>
                        </select>
                        <div className="invalid-feedback">
                          Please select a valid country.
                        </div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label for="state" className="form-label">
                          State
                        </label>
                        <br />
                        <select className="form-select" id="state" required>
                          <option value="">Choose...</option>
                          <option>Punjab</option>
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid state.
                        </div>
                      </div>

                      <div className="col-md-3 my-1">
                        <label for="zip" className="form-label">
                          Zip
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Zip code required.
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3">Payment</h4>
                    <button
                      className="w-100 btn btn-primary "
                      type="submit"
                    >
                      Continue to checkout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
