import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, removeSuccess, removeErrors } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const { loading, error, success, message } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const forgotPasswordEmail = (e) => {
    e.preventDefault();
    // ✅ Use a simple object for the API call instead of FormData
    const userData = { email }; 
    dispatch(forgotPassword(userData));
    setEmail("");
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(message || "Email sent successfully", { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess());
      // You may want to navigate the user after a successful email send
      // navigate("/login");
    }
  }, [dispatch, success, message]);

  return (
    <>
      <PageTitle title="forgot password" />
      <Navbar />
      <div className="container forgot-container"> {/* ✅ Corrected typo */}
        <div className="form-content email-group">
          <form className="form" onSubmit={forgotPasswordEmail}>
            <h2>Forgot Password</h2>
            <div className="input-group">
              <input 
                type="email" 
                placeholder='Enter your registered email' 
                name='email' 
                value={email} // ✅ FIXED: Added missing value prop
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            {/* ✅ Corrected button text */}
            <button className='authBtn' disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;