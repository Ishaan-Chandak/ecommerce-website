import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { auth, db } from '../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
    const [userDetails, setUserDetails] = useState(null)

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await auth.signOut()
            setUserDetails(null)
        } catch (error) {
            console.log(error);
        }
    }

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
    
    useEffect(() => {
        fetchUserData()
    }, [setUserDetails])

    const state = useSelector(state => state.handleCart)
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">Ecommerce Website</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {!userDetails && (
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-sign-in-alt mr-1"></i> Login
                                </NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-user-plus mr-1"></i> Register
                                </NavLink>
                            </>
                        )}
                        {userDetails && (
                            <>
                                <i className="mr-1">Hello {userDetails.firstName}</i>
                                <button className="btn btn-outline-dark m-2" onClick={handleLogout}>Logout</button>
                            </>
                        )}
                        <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}) </NavLink>
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar