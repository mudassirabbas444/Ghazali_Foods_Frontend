import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { getComparison, removeFromComparison, clearComparison } from '../../utils/productComparison';
import cartService from '../../services/cart';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const ProductComparisonPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = () => {
    const items = getComparison();
    setProducts(items);
    setLoading(false);
  };

  const handleRemove = (productId) => {
    removeFromComparison(productId);
    loadComparison();
    toast.success('Removed from comparison');
  };

  const handleClear = () => {
    clearComparison();
    setProducts([]);
    toast.success('Comparison cleared');
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      const variantWeight = product.variants?.[0]?.weight || 'default';
      await cartService.addToCart(product._id, variantWeight, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const getProductPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice 
        ? `Rs. ${minPrice.toLocaleString()}`
        : `Rs. ${minPrice.toLocaleString()} - Rs. ${maxPrice.toLocaleString()}`;
    }
    return `Rs. ${(product.basePrice || 0).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Products to Compare</h2>
            <p className="text-gray-600 mb-8">
              Add products to comparison to see them side by side
            </p>
            <Link
              to={ROUTES.SHOP}
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const comparisonFields = [
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price', isCustom: true },
    { key: 'description', label: 'Description' },
    { key: 'brand', label: 'Brand' },
    { key: 'origin', label: 'Origin' },
    { key: 'category', label: 'Category', isCustom: true },
    { key: 'rating', label: 'Rating', isCustom: true },
    { key: 'stock', label: 'Stock', isCustom: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
          <button
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold text-gray-700 w-48">Features</th>
                {products.map((product) => (
                  <th key={product._id} className="text-center p-4 w-64 relative">
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                    <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                      <div className="aspect-square w-32 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <FirebaseImage
                          src={product.thumbnail || product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field, idx) => (
                <tr key={field.key} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-4 font-medium text-gray-700">{field.label}</td>
                  {products.map((product) => (
                    <td key={product._id} className="p-4 text-center text-sm text-gray-600">
                      {field.isCustom ? (
                        <>
                          {field.key === 'price' && getProductPrice(product)}
                          {field.key === 'category' && (product.category?.name || 'N/A')}
                          {field.key === 'rating' && (
                            <div>
                              {product.averageRating > 0 ? (
                                <>
                                  ⭐ {product.averageRating.toFixed(1)} ({product.totalReviews})
                                </>
                              ) : (
                                'No ratings'
                              )}
                            </div>
                          )}
                          {field.key === 'stock' && (
                            <div>
                              {product.stock || product.variants?.[0]?.stock || 0} available
                            </div>
                          )}
                        </>
                      ) : (
                        product[field.key] || 'N/A'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonPage;

