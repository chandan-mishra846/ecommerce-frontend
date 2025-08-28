import React, { useEffect, useState } from 'react';
import '../pageStyles/Home.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
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

  // Calculate totalPages based on fetched data
  const totalPages = Math.ceil(productCount / resultPerPage);

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
          <Navbar />
          <ImageSlider />
          <div className="home-container">
            <h2 className="home-heading">Trending Now</h2>
            <div className="home-product-container">
              {products &&
                products.map((product, index) => (
                  <Product product={product} key={index} />
                ))}
            </div>

            {/* Wrap pagination in a centered wrapper */}
            <div className="pagination-wrapper">
              {/* Only render pagination if there are products and more than one page */}
              {products.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={totalPages} // Pass totalPages to Pagination
                />
              )}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Home;