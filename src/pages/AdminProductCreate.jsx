import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import '../AdminStyles/AdminProductCreate.css';
import '../AdminStyles/CreateProduct.css';

// Import Material UI icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Categories and brands (in a real app, these might come from the API)
const categories = [
  'Electronics',
  'Computers',
  'Smart Home',
  'Arts & Crafts',
  'Automotive',
  'Baby',
  'Beauty & Personal Care',
  'Books',
  'Fashion',
  'Health & Household',
  'Home & Kitchen',
  'Industrial & Scientific',
  'Luggage',
  'Movies & TV',
  'Music',
  'Pet Supplies',
  'Sports & Outdoors',
  'Tools & Home Improvement',
  'Toys & Games',
  'Video Games',
];

function AdminProductCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    brand: '',
    stock: '',
    warranty: '',
    seller: '',
    features: [''],
    specifications: [{ key: '', value: '' }],
    images: []
  });
  
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }]
    });
  };

  const removeSpecification = (index) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs.splice(index, 1);
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Preview images
    const imagePreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...imagePreviews]);
    
    // In a real app, you'd handle image upload differently
    // This is just for demonstration
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
    
    // Clear error when field is edited
    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      });
    }
  };

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
    
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) newErrors.price = 'Please enter a valid price';
    if (formData.discountPrice && (isNaN(formData.discountPrice) || parseFloat(formData.discountPrice) < 0)) newErrors.discountPrice = 'Please enter a valid discount price';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock) newErrors.stock = 'Stock quantity is required';
    else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) newErrors.stock = 'Please enter a valid stock quantity';
    if (!formData.seller.trim()) newErrors.seller = 'Seller name is required';
    if (formData.images.length === 0) newErrors.images = 'At least one product image is required';
    
    // Check if specifications have both key and value
    formData.specifications.forEach((spec, index) => {
      if (spec.key.trim() && !spec.value.trim()) {
        newErrors[`spec-value-${index}`] = 'Specification value is required';
      }
      if (!spec.key.trim() && spec.value.trim()) {
        newErrors[`spec-key-${index}`] = 'Specification name is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      setLoading(true);
      
      // Filter out empty features and specifications
      const cleanedData = {
        ...formData,
        features: formData.features.filter(feature => feature.trim() !== ''),
        specifications: formData.specifications.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '')
      };
      
      // In a real app, you'd dispatch an action to create the product
      console.log('Product data to submit:', cleanedData);
      
      // Simulate API call
      setTimeout(() => {
        alert('Product created successfully!');
        navigate('/admin/products');
      }, 1500);
      
    } catch (error) {
      console.error('Failed to create product:', error);
      setErrors({
        submit: 'Failed to create product. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-product-create-container">
          <div className="admin-page-header">
            <div>
              <h1>Create New Product</h1>
              <p>Add a new product to your inventory</p>
            </div>
            <button 
              className="back-button"
              onClick={() => navigate('/admin/products')}
            >
              <ArrowBackIcon /> Back to Products
            </button>
          </div>

          <form className="create-product-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-left-column">
                <div className="form-section basic-info">
                  <h3>Basic Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="name">Product Name <span className="required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description <span className="required">*</span></label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      rows={5}
                      className={errors.description ? 'error' : ''}
                    ></textarea>
                    {errors.description && <div className="error-message">{errors.description}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="price">Price ($) <span className="required">*</span></label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={errors.price ? 'error' : ''}
                      />
                      {errors.price && <div className="error-message">{errors.price}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="discountPrice">Discount Price ($)</label>
                      <input
                        type="number"
                        id="discountPrice"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={errors.discountPrice ? 'error' : ''}
                      />
                      {errors.discountPrice && <div className="error-message">{errors.discountPrice}</div>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category <span className="required">*</span></label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={errors.category ? 'error' : ''}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && <div className="error-message">{errors.category}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="brand">Brand</label>
                      <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Enter brand name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="stock">Stock Quantity <span className="required">*</span></label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className={errors.stock ? 'error' : ''}
                      />
                      {errors.stock && <div className="error-message">{errors.stock}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="warranty">Warranty</label>
                      <input
                        type="text"
                        id="warranty"
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleChange}
                        placeholder="e.g., 1 Year"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="seller">Seller <span className="required">*</span></label>
                    <input
                      type="text"
                      id="seller"
                      name="seller"
                      value={formData.seller}
                      onChange={handleChange}
                      placeholder="Enter seller name"
                      className={errors.seller ? 'error' : ''}
                    />
                    {errors.seller && <div className="error-message">{errors.seller}</div>}
                  </div>
                </div>
                
                <div className="form-section features">
                  <div className="section-header">
                    <h3>Key Features</h3>
                    <button 
                      type="button" 
                      className="add-button"
                      onClick={addFeature}
                    >
                      <AddIcon /> Add Feature
                    </button>
                  </div>
                  
                  {formData.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Enter a key feature"
                      />
                      {formData.features.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-button"
                          onClick={() => removeFeature(index)}
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-right-column">
                <div className="form-section images">
                  <h3>Product Images <span className="required">*</span></h3>
                  
                  <div className="image-upload-container">
                    <div className="image-upload-box">
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className={errors.images ? 'error' : ''}
                      />
                      <label htmlFor="images" className="upload-label">
                        <CloudUploadIcon className="upload-icon" />
                        <span>Click to upload images</span>
                        <small>PNG, JPG, or JPEG (max 5MB each)</small>
                      </label>
                    </div>
                    {errors.images && <div className="error-message">{errors.images}</div>}
                  </div>
                  
                  <div className="image-previews">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <button 
                          type="button" 
                          className="remove-image-button"
                          onClick={() => removeImage(index)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="form-section specifications">
                  <div className="section-header">
                    <h3>Technical Specifications</h3>
                    <button 
                      type="button" 
                      className="add-button"
                      onClick={addSpecification}
                    >
                      <AddIcon /> Add Specification
                    </button>
                  </div>
                  
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="specification-item">
                      <div className="spec-key">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                          placeholder="Specification name"
                          className={errors[`spec-key-${index}`] ? 'error' : ''}
                        />
                        {errors[`spec-key-${index}`] && <div className="error-message">{errors[`spec-key-${index}`]}</div>}
                      </div>
                      
                      <div className="spec-value">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                          placeholder="Specification value"
                          className={errors[`spec-value-${index}`] ? 'error' : ''}
                        />
                        {errors[`spec-value-${index}`] && <div className="error-message">{errors[`spec-value-${index}`]}</div>}
                      </div>
                      
                      {formData.specifications.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-button"
                          onClick={() => removeSpecification(index)}
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {errors.submit && <div className="form-error-message">{errors.submit}</div>}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <SaveIcon /> Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProductCreate;
