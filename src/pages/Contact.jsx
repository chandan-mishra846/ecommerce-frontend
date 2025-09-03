import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Headphones,
  Shield,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import '../pageStyles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      details: ["chandan.mishra23456@gmail.com", "support@shopeasy.com"],
      subtitle: "We'll respond within 24 hours"
    },
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      details: ["+91 7052022430", "Support: +91 7052022430"],
      subtitle: "Mon-Fri: 9AM-6PM IST"
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      details: ["Gandhinagar, Gujarat", "India"],
      subtitle: "Our headquarters"
    },
    {
      icon: <Clock size={24} />,
      title: "Business Hours",
      details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat-Sun: 10:00 AM - 4:00 PM"],
      subtitle: "Indian Standard Time"
    }
  ];

  const departments = [
    {
      icon: <Headphones size={20} />,
      name: "Customer Support",
      value: "support",
      description: "Help with orders, returns, and account issues"
    },
    {
      icon: <MessageCircle size={20} />,
      name: "Sales Inquiry",
      value: "sales",
      description: "Questions about products and bulk orders"
    },
    {
      icon: <Shield size={20} />,
      name: "Technical Support",
      value: "technical",
      description: "Website issues and technical problems"
    },
    {
      icon: <Mail size={20} />,
      name: "General Inquiry",
      value: "general",
      description: "General questions and feedback"
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order using the tracking number sent to your email, or log into your account to view order status."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
    }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, name: "Facebook", url: "#" },
    { icon: <Twitter size={20} />, name: "Twitter", url: "#" },
    { icon: <Instagram size={20} />, name: "Instagram", url: "#" },
    { icon: <Linkedin size={20} />, name: "LinkedIn", url: "#" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        department: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <motion.section 
        className="contact-hero"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="hero-content">
          <motion.h1 variants={fadeInUp}>
            Get in <span className="highlight">Touch</span>
          </motion.h1>
          <motion.p variants={fadeInUp}>
            We're here to help! Reach out to us through any of the channels below, 
            and we'll get back to you as soon as possible.
          </motion.p>
          <motion.div className="hero-stats" variants={stagger}>
            <motion.div className="stat-item" variants={fadeInUp}>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp}>
              <div className="stat-number">&lt;1hr</div>
              <div className="stat-label">Response Time</div>
            </motion.div>
            <motion.div className="stat-item" variants={fadeInUp}>
              <div className="stat-number">99%</div>
              <div className="stat-label">Customer Satisfaction</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section 
        className="contact-info-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index} 
                className="contact-info-card"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="info-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <div className="info-details">
                  {info.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
                <span className="info-subtitle">{info.subtitle}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Form & Map Section */}
      <motion.section 
        className="contact-form-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="form-map-container">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <motion.h2 variants={fadeInUp}>Send us a Message</motion.h2>
              <motion.p variants={fadeInUp}>
                Fill out the form below and we'll get back to you within 24 hours.
              </motion.p>

              {/* Department Selection */}
              <motion.div className="department-selection" variants={fadeInUp}>
                <h3>What can we help you with?</h3>
                <div className="department-grid">
                  {departments.map((dept) => (
                    <label 
                      key={dept.value} 
                      className={`department-card ${formData.department === dept.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="department"
                        value={dept.value}
                        checked={formData.department === dept.value}
                        onChange={handleInputChange}
                      />
                      <div className="dept-icon">{dept.icon}</div>
                      <div className="dept-name">{dept.name}</div>
                      <div className="dept-description">{dept.description}</div>
                    </label>
                  ))}
                </div>
              </motion.div>

              <motion.form 
                className="contact-form" 
                onSubmit={handleSubmit}
                variants={fadeInUp}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What's this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <motion.button 
                  type="submit" 
                  className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* Submit Status */}
                {submitStatus && (
                  <motion.div 
                    className={`submit-status ${submitStatus}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {submitStatus === 'success' ? (
                      <>
                        <CheckCircle size={20} />
                        <span>Message sent successfully! We'll get back to you soon.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} />
                        <span>There was an error sending your message. Please try again.</span>
                      </>
                    )}
                  </motion.div>
                )}
              </motion.form>
            </div>

            {/* Map Placeholder */}
            <motion.div 
              className="map-wrapper"
              variants={fadeInUp}
            >
              <div className="map-placeholder">
                <MapPin size={60} />
                <h3>Find Us Here</h3>
                <p>Gandhinagar, Gujarat<br />India</p>
                <button className="directions-button">
                  Get Directions
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="faq-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container">
          <motion.h2 variants={fadeInUp}>Frequently Asked Questions</motion.h2>
          <motion.p variants={fadeInUp}>
            Quick answers to questions you may have
          </motion.p>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="faq-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Social Links Section */}
      <motion.section 
        className="social-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <h2>Connect With Us</h2>
          <p>Follow us on social media for updates, deals, and community discussions</p>
          
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <motion.a 
                key={index}
                href={social.url}
                className="social-link"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
                <span>{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Emergency Contact */}
      <motion.section 
        className="emergency-contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="emergency-content">
            <div className="emergency-info">
              <h2>Need Immediate Help?</h2>
              <p>
                For urgent matters regarding your orders, security concerns, or technical issues 
                that need immediate attention, you can reach our emergency support line.
              </p>
              <div className="emergency-contact-details">
                <div className="emergency-phone">
                  <Phone size={20} />
                  <span>Emergency: +91 7052022430</span>
                </div>
                <div className="emergency-email">
                  <Mail size={20} />
                  <span>chandan.mishra23456@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="emergency-hours">
              <h3>Emergency Support Hours</h3>
              <ul>
                <li>Weekdays: 24/7 Support</li>
                <li>Weekends: 8AM - 10PM IST</li>
                <li>Holidays: Limited Support</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
