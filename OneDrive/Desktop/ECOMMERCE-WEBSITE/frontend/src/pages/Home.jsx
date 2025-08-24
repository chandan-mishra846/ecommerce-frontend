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
  const { loading, error, products, productCount, totalPages } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);

  console.log('Home component rendered', { loading, error, products, productCount, totalPages });

  useEffect(() => {
    console.log('Dispatching getProduct with page:', currentPage);
    dispatch(getProduct({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      console.log('Error in Home component:', error);
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
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Home;
