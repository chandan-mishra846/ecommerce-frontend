import React from 'react';
import '../componentStyles/Footer.css';
import {Phone ,Mail, GitHub, LinkedIn, YouTube, Instagram} from '@mui/icons-material';

function Footer() {
  return (
    
     <footer className="footer">
      <div className="footer-container">
              {/* Section 1 */}
             <div className="footer-section contact">
              <h3>Contact Us</h3>
              <p><Phone fontSize='small'/> Phone : +917052022430</p>
              <p><Mail fontSize='small'/>Email: chandan.mishra23456@gmail.com</p>
             </div>
             {/* Section 2 */}
            <div className='footer-section social'>
               <h3>Follow me</h3>
               <div className='social-links'>
                <a href="" target="_blank">
                  <GitHub className='social-icon'/>
                </a>
                <a href="" target="_blank">
                  <LinkedIn className='social-icon'/>
                </a>
                <a href="" target="_blank">
                  <YouTube className='social-icon'/>
                </a>
                <a href="" target="_blank">
                  <Instagram className='social-icon'/>
                </a>
               </div>

            </div>
              {/* Section 3 */}
            <div className='footer-section about'>
               <h3>About</h3>
               <p>We are an online store dedicated to providing quality products at affordable prices. Our goal is to make your shopping experience easy, fast, and reliable.</p>
               </div>
      </div>
      <div className='footer-bottom'>
        <p>&copy; 2025 Chandan Mishra .All rights reserved</p>
      </div>
      </footer>
    
     
  )
}

export default Footer;
