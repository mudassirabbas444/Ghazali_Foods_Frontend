import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Check } from 'lucide-react';
import productService from '../../services/product';
import cartService from '../../services/cart';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../FirebaseImage';

const ProductBundles = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, [product]);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      // TODO: Implement backend endpoint for product bundles
      // For now, showing related products as "frequently bought together"
      const filters = {
        category: product?.category?._id || product?.category,
        limit: 3,
        isActive: true,
      };
      const response = await productService.getProducts(filters);
      if (response.success) {
        const related = (response.products || [])
          .filter(p => p._id !== product?._id)
          .slice(0, 3);
        
        if (related.length > 0) {
          const bundlePrice = related.reduce((sum, p) => sum + (p.basePrice || 0), 0);
          const bundleDiscount = 10; // 10% discount on bundle
          const bundleTotal = bundlePrice * (1 - bundleDiscount / 100);
          
          setBundles([{
            products: related,
            originalPrice: bundlePrice,
            discount: bundleDiscount,
            totalPrice: bundleTotal,
            savings: bundlePrice - bundleTotal,
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundleToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      return;
    }

    try {
      // Add all bundle products to cart
      for (const bundleProduct of bundles[0].products) {
        const variantWeight = bundleProduct.variants?.[0]?.weight || 'default';
        await cartService.addToCart(bundleProduct._id, variantWeight, 1);
      }
      toast.success('Bundle added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add bundle to cart');
    }
  };

  if (loading || bundles.length === 0) {
    return null;
  }

  const bundle = bundles[0];

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Frequently Bought Together</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products */}
        <div className="space-y-4">
          {bundle.products.map((bundleProduct, idx) => (
            <div key={bundleProduct._id} className="flex items-center gap-4">
              {idx > 0 && (
                <div className="text-2xl text-gray-400">+</div>
              )}
              <Link
                to={ROUTES.PRODUCT_DETAIL.replace(':slug', bundleProduct.slug)}
                className="flex items-center gap-3 flex-1"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <FirebaseImage
                    src={bundleProduct.thumbnail || bundleProduct.images?.[0]}
                    alt={bundleProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {bundleProduct.name}
                  </h3>
                  <p className="text-sm font-semibold text-green-600">
                    Rs. {(bundleProduct.basePrice || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bundle Info */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="font-bold text-gray-900 mb-4">Bundle Price</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Original Price:</span>
              <span className="text-gray-500 line-through">
                Rs. {bundle.originalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Discount ({bundle.discount}%):</span>
              <span className="text-red-600 font-semibold">
                -Rs. {bundle.savings.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-green-200">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                Rs. {bundle.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={handleAddBundleToCart}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add Bundle to Cart
          </button>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
            <Check className="w-4 h-4" />
            <span>Save Rs. {bundle.savings.toLocaleString()} with this bundle!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBundles;

