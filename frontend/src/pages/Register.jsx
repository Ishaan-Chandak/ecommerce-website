import React, {useState} from 'react'
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
import { auth, db } from '../firebase/firebase'
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("In handle register");
        try {
            await doCreateUserWithEmailAndPassword(email, password)
            const user = auth.currentUser;
            if(user){
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: fname,
                    lastName: lname,
                })
            }
            toast.success("User Registered Successfully !!", {position: "top-center"})
        } catch (error) {   
            // console.log(error.message);
            toast.error(error.message, {position: "bottom-center"})
        }
    }

    return (
        <>
            <Navbar />
                <div className="container my-3 py-3">
                    <h1 className="text-center">Register</h1>
                    <hr />
                    <div class="row my-4 h-100">
                        <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                            <form onSubmit={handleRegister}>
                                <div class="form my-3">
                                    <label for="FirstName">First Name</label>
                                    <input
                                        class="form-control"
                                        id="fName"
                                        placeholder="Enter Your First Name"
                                        value={fname}
                                        onChange={(e) => setFname(e.target.value)}
                                    />
                                </div>
                                <div class="form my-3">
                                    <label for="LastName">Last Name</label>
                                    <input
                                        class="form-control"
                                        id="lName"
                                        placeholder="Enter Your Last Name"
                                        value={lname}
                                        onChange={(e) => setLname(e.target.value)}
                                    />
                                </div>
                                <div class="form my-3">
                                    <label for="Email">Email address</label>
                                    <input
                                        type="email"
                                        class="form-control"
                                        id="Email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => {setEmail(e.target.value)}}
                                    />
                                </div>
                                <div class="form  my-3">
                                    <label for="Password">Password</label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="Password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="my-3">
                                    <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                                </div>
                                <div className="text-center">
                                    <button class="my-2 mx-auto btn btn-dark" type="submit">
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    )
}

export default Register