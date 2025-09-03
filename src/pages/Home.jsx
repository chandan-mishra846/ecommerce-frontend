import React, { useEffect, useState } from 'react';
import '../pageStyles/Home.css';
import Footer from '../components/Footer';
import NavbarSelector from '../components/NavbarSelector';
import Loader from '../components/Loader';
import ImageSlider from '../components/ImageSlider';
import Product from '../components/Product';
import PageTitle from '../components/PageTitle';
import Pagination from '../components/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';
import { toast } from 'react-toastify';

function Home() {
  // Destructure productCount and resultPerPage from state directly
  const { loading, error, products, productCount, resultPerPage } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Calculate totalPages based on fetched data
  const totalPages = Math.ceil(productCount / resultPerPage);

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // console.log('Home component rendered', { loading, error, products, productCount, totalPages }); // Temporarily disable this log to reduce console noise

  useEffect(() => {
    // console.log('Dispatching getProduct with page:', currentPage); // Temporarily disable this log
    dispatch(getProduct({ page: currentPage }));
    return () => dispatch(removeErrors()); 
  }, [dispatch, currentPage]); // Dependencies are correct here, only re-run on currentPage change

  useEffect(() => {
    if (error) {
      console.error('Error in Home component:', error);
      toast.error(error.message, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Home - My Website" />
          <ImageSlider />
          <div className="home-container">
            <h2 className="home-heading">Trending Now</h2>
            <p className="home-subheading">Fresh picks curated for you. Discover the latest and greatest.</p>

            {products && products.length > 0 ? (
              <div className="home-product-container">
                {products.map((product) => (
                  <Product product={product} key={product._id} />
                ))}
              </div>
            ) : (
              <div className="no-products-message">
                <h3>No products to show</h3>
                <p>Please check back later or adjust your filters.</p>
              </div>
            )}

            {/* pagination */}
            <div className="pagination-wrapper">
              {products && products.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
          
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button 
              className="scroll-to-top"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              ↑
            </button>
          )}
          
          <Footer />
        </>
      )}
    </>
  );
}

export default Home;