import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import toast from "react-hot-toast";
// import { useAuth } from "../contexts/authContext";

const Login = () => {
  // const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isSigningIn) {
      setIsSigningIn(true)
      await doSignInWithEmailAndPassword(email, password)
      toast.success("Logged in Successfully")
    }
  }
  // const onGoogleSignIn = (e) => {
  //     e.preventDefault()
  //     if (!isSigningIn) {
  //         setIsSigningIn(true)
  //         doSignInWithGoogle().catch(err => {
  //             setIsSigningIn(false)
  //         })
  //     }
  // }

  return (
    <>
      {isSigningIn && (<Navigate to={'/'} replace={true} />)}
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div class="my-3">
                <label for="display-4">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value)}}
                />
              </div>
              <div class="my-3">
                <label for="floatingPassword display-4">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div class="my-3">
                {errorMessage && (
                    <span className='text-red-600 font-bold'>{errorMessage}</span>
                )}
              </div>
              <div className="text-center">
                <button class="my-2 mx-auto btn btn-dark" type="submit" disabled={isSigningIn}>
                  {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
