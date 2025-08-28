import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './SellerProfile.css';

function SellerProfile() {
  const { user } = useSelector((state) => state.user);

  if (!user || user.role !== 'seller') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need to be a registered seller to view this page.</p>
      </div>
    );
  }

  const { sellerInfo } = user;

  return (
    <div className="seller-profile-container">
      <div className="seller-profile-header">
        <h1>Seller Profile</h1>
        <div className="verification-status">
          <span className={`status-badge ${sellerInfo?.verificationStatus || 'pending'}`}>
            {sellerInfo?.verificationStatus === 'approved' && '✓ Verified'}
            {sellerInfo?.verificationStatus === 'pending' && '⏳ Pending'}
            {sellerInfo?.verificationStatus === 'rejected' && '❌ Rejected'}
          </span>
        </div>
      </div>

      <div className="profile-sections">
        {/* Basic Information */}
        <div className="profile-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        {sellerInfo && (
          <>
            <div className="profile-section">
              <h3>Company Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Company Name:</label>
                  <span>{sellerInfo.companyName}</span>
                </div>
                <div className="info-item">
                  <label>Business Type:</label>
                  <span>{sellerInfo.businessType}</span>
                </div>
                <div className="info-item">
                  <label>GST Number:</label>
                  <span>{sellerInfo.gstNumber}</span>
                </div>
                <div className="info-item">
                  <label>PAN Number:</label>
                  <span>{sellerInfo.panNumber}</span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="profile-section">
              <h3>Business Address</h3>
              <div className="info-grid">
                <div className="info-item full-width">
                  <label>Street:</label>
                  <span>{sellerInfo.address?.street}</span>
                </div>
                <div className="info-item">
                  <label>City:</label>
                  <span>{sellerInfo.address?.city}</span>
                </div>
                <div className="info-item">
                  <label>State:</label>
                  <span>{sellerInfo.address?.state}</span>
                </div>
                <div className="info-item">
                  <label>PIN Code:</label>
                  <span>{sellerInfo.address?.pincode}</span>
                </div>
                <div className="info-item">
                  <label>Country:</label>
                  <span>{sellerInfo.address?.country}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="profile-section">
              <h3>Contact Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Phone:</label>
                  <span>{sellerInfo.contact?.phone}</span>
                </div>
                <div className="info-item">
                  <label>WhatsApp:</label>
                  <span>{sellerInfo.contact?.whatsapp || 'Not provided'}</span>
                </div>
                <div className="info-item full-width">
                  <label>Website:</label>
                  <span>{sellerInfo.contact?.website || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="profile-section">
              <h3>Bank Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Account Holder:</label>
                  <span>{sellerInfo.bankDetails?.accountHolderName}</span>
                </div>
                <div className="info-item">
                  <label>Account Number:</label>
                  <span>****{sellerInfo.bankDetails?.accountNumber?.slice(-4)}</span>
                </div>
                <div className="info-item">
                  <label>Bank Name:</label>
                  <span>{sellerInfo.bankDetails?.bankName}</span>
                </div>
                <div className="info-item">
                  <label>IFSC Code:</label>
                  <span>{sellerInfo.bankDetails?.ifscCode}</span>
                </div>
                <div className="info-item">
                  <label>Branch:</label>
                  <span>{sellerInfo.bankDetails?.branchName}</span>
                </div>
                <div className="info-item">
                  <label>Account Type:</label>
                  <span>{sellerInfo.bankDetails?.accountType}</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="profile-section">
              <h3>Uploaded Documents</h3>
              <div className="documents-grid">
                {sellerInfo.documents?.businessLicense && (
                  <div className="document-item">
                    <label>Business License:</label>
                    <a href={sellerInfo.documents.businessLicense.url} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </div>
                )}
                {sellerInfo.documents?.gstCertificate && (
                  <div className="document-item">
                    <label>GST Certificate:</label>
                    <a href={sellerInfo.documents.gstCertificate.url} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </div>
                )}
                {sellerInfo.documents?.panCard && (
                  <div className="document-item">
                    <label>PAN Card:</label>
                    <a href={sellerInfo.documents.panCard.url} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </div>
                )}
                {(!sellerInfo.documents?.businessLicense && !sellerInfo.documents?.gstCertificate && !sellerInfo.documents?.panCard) && (
                  <p className="no-documents">No documents uploaded</p>
                )}
              </div>
            </div>

            {/* Verification Status Details */}
            <div className="profile-section">
              <h3>Verification Status</h3>
              <div className="verification-details">
                <div className="status-info">
                  <span className={`status-indicator ${sellerInfo.verificationStatus}`}>
                    {sellerInfo.verificationStatus === 'approved' && '✅ Approved'}
                    {sellerInfo.verificationStatus === 'pending' && '⏳ Under Review'}
                    {sellerInfo.verificationStatus === 'rejected' && '❌ Rejected'}
                  </span>
                  <div className="status-description">
                    {sellerInfo.verificationStatus === 'approved' && 
                      'Your seller account has been verified. You can start selling products.'
                    }
                    {sellerInfo.verificationStatus === 'pending' && 
                      'Your seller account is under review. We will notify you once the verification is complete.'
                    }
                    {sellerInfo.verificationStatus === 'rejected' && 
                      'Your seller account verification was rejected. Please contact support for more information.'
                    }
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;
