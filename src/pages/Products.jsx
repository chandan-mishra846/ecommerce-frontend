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
  const { loading, error, products, resultPerPage, productCount } = useSelector(
    (state) => state.product
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase() || '';
  const pageFromURL = parseInt(searchParams.get('page'), 10) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromURL);

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage }));
  }, [dispatch, keyword, currentPage]);

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

  // ✅ Filter based on description and category
  const filteredProducts = products.filter((product) => {
    const matchDescription = keyword
      ? product.description?.toLowerCase().includes(keyword)
      : true;
    const matchCategory = category
      ? product.category?.toLowerCase() === category
      : true;
    return matchDescription && matchCategory;
  });

  // ✅ Get unique categories from product list
  const allCategories = [...new Set(products.map((p) => p.category))];

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
                    className={category === cat.toLowerCase() ? 'active' : ''}
                    onClick={() => handleCategoryClick(cat.toLowerCase())}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Products Display */}
            <div className="products-section">
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