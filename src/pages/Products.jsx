import React, { useEffect, useState } from 'react';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import NoProducts from '../components/NoProducts';
import Pagination from '../components/pagination';

function Products() {
  const { loading, error, products, resultPerPage, productCount, allCategories } = useSelector(
    (state) => state.product
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';
  const pageFromURL = parseInt(searchParams.get('page'), 10) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromURL);

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }));
  }, [dispatch, keyword, currentPage, category]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handlePagechange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const totalPages = Math.ceil(productCount / resultPerPage);

  // ✅ Since backend now handles category filtering, we don't need frontend filtering for category
  // Only keep keyword filtering for client-side search within fetched results
  const filteredProducts = keyword
    ? products.filter((product) =>
        product.description?.toLowerCase().includes(keyword)
      )
    : products;

  const handleCategoryClick = (cat) => {
    const newSearchParams = new URLSearchParams(location.search);
    if (cat) {
      newSearchParams.set('category', cat);
    } else {
      newSearchParams.delete('category');
    }
    newSearchParams.delete('page'); // reset to page 1
    navigate(`?${newSearchParams.toString()}`);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Product Section" />
          <Navbar />
          <div className="products-layout">
            {/* Sidebar Filter */}
            <div className="filter-section">
              <h3 className="filter-heading">Category</h3>
              <ul className="category-list">
                <li
                  className={!category ? 'active' : ''}
                  onClick={() => handleCategoryClick('')}
                >
                  All
                </li>
                {allCategories.map((cat) => (
                  <li
                    key={cat}
                    className={category === cat ? 'active' : ''}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Products Display */}
            <div className="products-section">
              {/* Products Header */}
              <div className="products-header">
                <h1>Discover Amazing Products</h1>
                <p>Find the perfect items from our curated collection</p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="products-product-container">
                  {filteredProducts.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProducts keyword={keyword || category} />
              )}

              {/* ✅ Hide pagination if only one page or no products */}
              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="pagination">
                  <Pagination
                    currentPage={currentPage}
                    onPageChange={handlePagechange}
                    activeClass="active"
                    totalPages={totalPages}
                  />
                </div>
              )}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Products;