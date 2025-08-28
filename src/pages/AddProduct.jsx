import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../pageStyles/AddProduct.css';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Product categories
  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Beauty & Personal Care',
    'Toys & Games',
    'Automotive',
    'Food & Beverages',
    'Health & Wellness',
    'Jewelry',
    'Computers',
    'Mobile Phones',
    'Furniture',
    'Fashion Accessories'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages([]);
    setImagePreviews([]);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagePreviews(prev => [...prev, reader.result]);
            setImages(prev => [...prev, reader.result]);
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select only image files');
      }
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (formData.stock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        images: images
      };

      const response = await fetch('/api/v1/seller/product/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
        });
        setImages([]);
        setImagePreviews([]);
        
        // Redirect to seller products page
        setTimeout(() => {
          navigate('/seller/products');
        }, 2000);
      } else {
        toast.error(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product. Please try again.');
    }

    setLoading(false);
  };

  // Check if user is seller
  if (!user || user.role !== 'seller') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need to be a registered seller to add products.</p>
      </div>
    );
  }

  return (
    <>
      <div className="add-product-container">
        <div className="add-product-header">
          <h1>Add New Product</h1>
          <p>Fill in the details below to add a new product to your store</p>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="input-row">
              <div className="input-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed product description"
                rows="5"
                required
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="form-section">
            <h3>Pricing & Stock</h3>
            
            <div className="input-row">
              <div className="input-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="input-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="form-section">
            <h3>Product Images</h3>
            <p className="section-desc">Upload up to 5 images of your product</p>
            
            <div className="input-group">
              <label>Upload Images *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file-input"
                required={images.length === 0}
              />
              <small>Supported formats: JPG, PNG, WebP (Max 5 images)</small>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                <h4>Image Previews</h4>
                <div className="preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/seller/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProduct;
