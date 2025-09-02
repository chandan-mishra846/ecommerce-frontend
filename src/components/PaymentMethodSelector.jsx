import React, { useState } from 'react';
import TestModePayment from './TestModePayment';
import '../componentStyles/StripePayment.css';

const PaymentMethodSelector = ({ orderInfo, onPaymentSuccess, onPaymentError }) => {
  const [key, setKey] = useState(Date.now()); // Force re-render
  
  return (
    <div className="payment-method-selector">
      <div className="payment-form">
        <TestModePayment
          key={key}
          orderInfo={orderInfo}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
