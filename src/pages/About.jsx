import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  Award, 
  TrendingUp, 
  Shield, 
  Truck, 
  Heart,
  Star,
  CheckCircle
} from 'lucide-react';
import '../pageStyles/About.css';

const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const stats = [
    { icon: <Users size={24} />, number: "10,000+", label: "Happy Customers" },
    { icon: <ShoppingBag size={24} />, number: "50,000+", label: "Products Sold" },
    { icon: <Award size={24} />, number: "500+", label: "Trusted Sellers" },
    { icon: <TrendingUp size={24} />, number: "99%", label: "Customer Satisfaction" }
  ];

  const values = [
    {
      icon: <Shield size={32} />,
      title: "Trust & Security",
      description: "Your data and transactions are protected with industry-leading security measures."
    },
    {
      icon: <Heart size={32} />,
      title: "Customer First",
      description: "Every decision we make is centered around providing the best experience for our customers."
    },
    {
      icon: <Truck size={32} />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your products to you as fast as possible."
    },
    {
      icon: <Star size={32} />,
      title: "Quality Assured",
      description: "We work only with verified sellers who meet our high standards for quality."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Customer",
      comment: "ShopEasy has transformed my online shopping experience. The quality of products and customer service is exceptional!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Seller",
      comment: "As a seller, ShopEasy provides all the tools I need to grow my business. The platform is user-friendly and supportive.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Customer",
      comment: "Fast delivery, great prices, and amazing customer support. I recommend ShopEasy to all my friends!",
      rating: 5
    }
  ];

  const team = [
    {
      name: "Alex Rodriguez",
      role: "CEO & Founder",
      image: "/images/team/ceo.jpg",
      bio: "Visionary leader with 10+ years in e-commerce"
    },
    {
      name: "Sarah Kim",
      role: "CTO",
      image: "/images/team/cto.jpg",
      bio: "Tech expert ensuring platform reliability and innovation"
    },
    {
      name: "David Thompson",
      role: "Head of Operations",
      image: "/images/team/operations.jpg",
      bio: "Operations specialist focused on seamless customer experience"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="hero-content">
          <div className="hero-text">
            <motion.h1 variants={fadeInUp}>
              About <span className="highlight">ShopEasy</span>
            </motion.h1>
            <motion.p variants={fadeInUp}>
              We're revolutionizing online shopping by connecting customers with trusted sellers 
              worldwide, providing a seamless, secure, and delightful shopping experience.
            </motion.p>
            <motion.div className="hero-buttons" variants={fadeInUp}>
              <button className="cta-button primary">Our Story</button>
              <button className="cta-button secondary">Join Our Team</button>
            </motion.div>
          </div>
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-graphic">
              <ShoppingBag size={120} className="main-icon" />
              <div className="floating-icons">
                <Heart size={24} className="floating-icon icon-1" />
                <Star size={20} className="floating-icon icon-2" />
                <Shield size={26} className="floating-icon icon-3" />
                <Award size={22} className="floating-icon icon-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="stat-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section 
        className="story-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2020 with a simple mission: to make online shopping accessible, 
                trustworthy, and enjoyable for everyone. What started as a small team with 
                big dreams has grown into a thriving marketplace connecting thousands of 
                customers with quality products from verified sellers worldwide.
              </p>
              <p>
                Our journey began when we noticed the gap between customer expectations 
                and the reality of online shopping. We set out to bridge that gap by 
                creating a platform that prioritizes quality, security, and customer satisfaction.
              </p>
              <div className="story-highlights">
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Rigorous seller verification process</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>24/7 customer support</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Secure payment processing</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Fast and reliable shipping</span>
                </div>
              </div>
            </div>
            <div className="story-image">
              <motion.div 
                className="image-placeholder"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingUp size={80} />
                <p>Our Growth Journey</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="values-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container">
          <motion.h2 variants={fadeInUp}>Our Core Values</motion.h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="value-card"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="team-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container">
          <motion.h2 variants={fadeInUp}>Meet Our Team</motion.h2>
          <motion.p className="team-subtitle" variants={fadeInUp}>
            The passionate individuals behind ShopEasy's success
          </motion.p>
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                className="team-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="team-image">
                  <Users size={60} />
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="testimonials-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <h2>What People Say About Us</h2>
          <div className="testimonial-carousel">
            <motion.div 
              className="testimonial-card"
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={20} className="star-filled" />
                  ))}
                </div>
                <p>"{testimonials[currentTestimonial].comment}"</p>
                <div className="testimonial-author">
                  <strong>{testimonials[currentTestimonial].name}</strong>
                  <span>{testimonials[currentTestimonial].role}</span>
                </div>
              </div>
            </motion.div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of satisfied customers and discover amazing products today!</p>
          <div className="cta-buttons">
            <button className="cta-button primary">Browse Products</button>
            <button className="cta-button secondary">Become a Seller</button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
