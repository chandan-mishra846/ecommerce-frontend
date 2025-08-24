import React from 'react'
import '../componentStyles/NoProducts.css';

function NoProducts({keyword}) {
  return (
     <div className="no-products-content">
        <div className="no-products-icon">⚠️</div>
            <h3 className="no-products-title">No Product Found</h3>
            <p className="no-product-message">
                {keyword?`We could not find any products matching ${keyword} . Try using different keyword or browse our complete catalog.`:'No products are availabel.Please check back later '}
            </p>
        
     </div>
  )
}

export default NoProducts
