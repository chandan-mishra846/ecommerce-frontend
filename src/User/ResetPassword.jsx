import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../UserStyles/Form.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { removeSuccess, resetPassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { removeErrors } from '../features/user/userSlice';

function ResetPassword() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, loading, error } = useSelector((state) => state.user);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Handle error toast
  useEffect(() => {
    if (error) {
      toast.error(error.message || error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  // ✅ Handle success toast
  useEffect(() => {
    if (success) {
      toast.success("Password updated successfully", { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/login"); // Redirect to login after password reset
    }
  }, [success, dispatch, navigate]);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: 'top-center', autoClose: 3000 });
      return;
    }

    // Dispatch resetPassword thunk
    dispatch(resetPassword({ token, userData: { password, confirmPassword } }));
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Reset Password" />
      <div className="container form-container">
        <div className="form-content">
          <form className="form" onSubmit={resetPasswordSubmit}>
            <h2>Reset Password</h2>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
