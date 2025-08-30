import React from 'react';

function SimpleHome() {
  return (
    <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
      <h1>Simple Home Page Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ background: 'red', color: 'white', padding: '10px', margin: '10px' }}>
        This is a test div with red background
      </div>
    </div>
  );
}

export default SimpleHome;
