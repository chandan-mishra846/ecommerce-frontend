import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import '../UserStyles/SellerRegister.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, removeErrors, removeSuccess } from '../features/user/userSlice';

function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Default role
  });

  const [sellerInfo, setSellerInfo] = useState({
    companyName: '',
    businessType: 'Individual',
    gstNumber: '',
    panNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    whatsapp: '',
    website: '',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branchName: '',
    accountType: 'Savings'
  });

  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('./images/jony-dep.png');
  const [documents, setDocuments] = useState({
    businessLicense: null,
    gstCertificate: null,
    panCard: null
  });

  const { name, email, password, role } = user;

  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerDataChange = (e) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      setAvatar(file);
    } else if (e.target.name.startsWith('seller_')) {
      const fieldName = e.target.name.replace('seller_', '');
      setSellerInfo({ ...sellerInfo, [fieldName]: e.target.value });
    } else if (e.target.name.startsWith('doc_')) {
      const docType = e.target.name.replace('doc_', '');
      const file = e.target.files[0];
      setDocuments({ ...documents, [docType]: file });
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill out all the required fields', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    // Validate seller fields if role is seller
    if (role === 'seller') {
      const requiredSellerFields = [
        'companyName', 'businessType', 'gstNumber', 'panNumber',
        'street', 'city', 'state', 'pincode', 'phone',
        'accountHolderName', 'accountNumber', 'bankName', 'ifscCode', 'branchName'
      ];

      for (const field of requiredSellerFields) {
        if (!sellerInfo[field]) {
          toast.error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required for seller registration`, {
            position: 'top-center',
            autoClose: 3000,
          });
          return;
        }
      }
    }

    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('password', password);
    myForm.set('role', role);
    myForm.set('avatar', avatar);

    // Add seller-specific data if role is seller
    if (role === 'seller') {
      Object.keys(sellerInfo).forEach(key => {
        myForm.set(key, sellerInfo[key]);
      });

      // Add documents if uploaded
      Object.keys(documents).forEach(docType => {
        if (documents[docType]) {
          myForm.set(docType, documents[docType]);
        }
      });
    }

    dispatch(register(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success('Registration successful', {
        position: 'top-center',
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate('/login');
    }
  }, [dispatch, success]);

  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form seller-register-form" onSubmit={registerSubmit} encType="multipart/form-data">
          <h2>Sign Up</h2>

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                  required
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter password (min 8 characters)"
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Register As *</label>
                <select
                  name="role"
                  value={role}
                  onChange={registerDataChange}
                  className="role-select"
                  required
                >
                  <option value="user">Customer</option>
                  <option value="seller">Seller/Business</option>
                </select>
              </div>
            </div>

            <div className="input-group avatar-group">
              <label>Profile Picture *</label>
              <div className="avatar-upload">
                <input
                  type="file"
                  name="avatar"
                  className="file-input"
                  accept="image/*"
                  onChange={registerDataChange}
                  required
                />
                <img src={avatarPreview} alt="Avatar Preview" className="avatar" />
              </div>
            </div>
          </div>

          {/* Seller Information - Only show if role is seller */}
          {role === 'seller' && (
            <>
              {/* Company Information */}
              <div className="form-section">
                <h3>Company Information</h3>
                <div className="input-row">
                  <div className="input-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      name="seller_companyName"
                      value={sellerInfo.companyName}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Business Type *</label>
                    <select
                      name="seller_businessType"
                      value={sellerInfo.businessType}
                      onChange={registerDataChange}
                      required
                    >
                      <option value="Individual">Individual</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Partnership">Partnership</option>
                      <option value="LLP">LLP</option>
                      <option value="Proprietorship">Proprietorship</option>
                    </select>
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>GST Number *</label>
                    <input
                      type="text"
                      placeholder="Enter GST number"
                      name="seller_gstNumber"
                      value={sellerInfo.gstNumber}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>PAN Number *</label>
                    <input
                      type="text"
                      placeholder="Enter PAN number"
                      name="seller_panNumber"
                      value={sellerInfo.panNumber}
                      onChange={registerDataChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="form-section">
                <h3>Business Address</h3>
                <div className="input-group full-width">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    placeholder="Enter street address"
                    name="seller_street"
                    value={sellerInfo.street}
                    onChange={registerDataChange}
                    required
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>City *</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      name="seller_city"
                      value={sellerInfo.city}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>State *</label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      name="seller_state"
                      value={sellerInfo.state}
                      onChange={registerDataChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      placeholder="Enter PIN code"
                      name="seller_pincode"
                      value={sellerInfo.pincode}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="seller_country"
                      value={sellerInfo.country}
                      onChange={registerDataChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="input-row">
                  <div className="input-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      name="seller_phone"
                      value={sellerInfo.phone}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="Enter WhatsApp number"
                      name="seller_whatsapp"
                      value={sellerInfo.whatsapp}
                      onChange={registerDataChange}
                    />
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Website</label>
                  <input
                    type="url"
                    placeholder="Enter website URL"
                    name="seller_website"
                    value={sellerInfo.website}
                    onChange={registerDataChange}
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="form-section">
                <h3>Bank Details</h3>
                <div className="input-row">
                  <div className="input-group">
                    <label>Account Holder Name *</label>
                    <input
                      type="text"
                      placeholder="Enter account holder name"
                      name="seller_accountHolderName"
                      value={sellerInfo.accountHolderName}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Account Number *</label>
                    <input
                      type="text"
                      placeholder="Enter account number"
                      name="seller_accountNumber"
                      value={sellerInfo.accountNumber}
                      onChange={registerDataChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Bank Name *</label>
                    <input
                      type="text"
                      placeholder="Enter bank name"
                      name="seller_bankName"
                      value={sellerInfo.bankName}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>IFSC Code *</label>
                    <input
                      type="text"
                      placeholder="Enter IFSC code"
                      name="seller_ifscCode"
                      value={sellerInfo.ifscCode}
                      onChange={registerDataChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Branch Name *</label>
                    <input
                      type="text"
                      placeholder="Enter branch name"
                      name="seller_branchName"
                      value={sellerInfo.branchName}
                      onChange={registerDataChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Account Type *</label>
                    <select
                      name="seller_accountType"
                      value={sellerInfo.accountType}
                      onChange={registerDataChange}
                      required
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="form-section">
                <h3>Document Upload</h3>
                <div className="input-row">
                  <div className="input-group">
                    <label>Business License</label>
                    <input
                      type="file"
                      name="doc_businessLicense"
                      className="file-input"
                      accept="image/*,.pdf"
                      onChange={registerDataChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>GST Certificate</label>
                    <input
                      type="file"
                      name="doc_gstCertificate"
                      className="file-input"
                      accept="image/*,.pdf"
                      onChange={registerDataChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>PAN Card</label>
                  <input
                    type="file"
                    name="doc_panCard"
                    className="file-input"
                    accept="image/*,.pdf"
                    onChange={registerDataChange}
                  />
                </div>
              </div>
            </>
          )}

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>

          <p className="form-links">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
