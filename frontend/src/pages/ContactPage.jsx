import React, {useState} from "react";
import { Footer, Navbar } from "../components";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
const ContactPage = () => {
  const [name, setName] = useState("")
  const [email,setEmail] = useState("")
  const [message, setMessage] = useState("")
 
  function getCurrentTimestamp() {
    return Date.now().toString();
  }

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "Enquiries", getCurrentTimestamp()), {
        name: name,
        email: email,
        message: message
      });
      toast.success("Thanks for submitting the enquiry, we will reach out to you in 2-3 business days.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("There was an issue submitting your enquiry. Please try again later.");
      console.error("Error submitting contact form:", error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Contact Us</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleContact}>
              <div class="form my-3">
                <label for="Name">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="Name"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div class="form my-3">
                <label for="Email">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="Email"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div class="form  my-3">
                <label for="Message">Message</label>
                <textarea
                  rows={5}
                  class="form-control"
                  id="Message"
                  placeholder="Enter your message"
                  onChange={(e) => setMessage(e.target.value)}
                   value={message}
                />
              </div>
              <div className="text-center">
                <button
                  class="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
