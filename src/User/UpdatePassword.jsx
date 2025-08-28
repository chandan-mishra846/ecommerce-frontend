import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeErrors, updatePassword, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify'

function UpdatePassword() {
  // Fix: The useSelector hook needs to receive a function that takes 'state' as an argument.
  const { success, loading, error } = useSelector((state) => state.user) 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
  
    dispatch(updatePassword(myForm));
  };
  
  useEffect(() => {
    if (error) {
      toast.error(error.message || error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Password updated successfully", { position: 'top-center', autoClose: 3000 });
      // Fix: removeSuccess must be imported to be used here
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [dispatch, success, navigate]); // Added navigate to dependency array

  return (
    <>
      <Navbar/>
      <PageTitle title="Password Update"/>
      <div className="container update-container">
        <div className="form-content">
          <form className="form" onSubmit={updatePasswordSubmit}>
            <h2>Update Password</h2>
            <div className="input-group">
              <input 
                type="password" 
                name="oldPassword" 
                placeholder='oldPassword' 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                name='newPassword' 
                placeholder='newPassword' 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                name='confirmPassword' 
                placeholder='confirmPassword' 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="authBtn">Update Password</button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default UpdatePassword; 