import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Loader2 } from 'lucide-react';
import productService from '../../services/product';
import cartService from '../../services/cart';
import wishlistService from '../../services/wishlist';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../FirebaseImage';

const RelatedProducts = ({ product, limit = 8 }) => {
  const { isAuthenticated } = useAuth();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(new Set());

  useEffect(() => {
    fetchRelatedProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [product]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      const filters = {
        category: product?.category?._id || product?.category,
        limit,
        isActive: true,
      };
      const response = await productService.getProducts(filters);
      if (response.success) {
        // Filter out current product
        const filtered = (response.products || []).filter(
          p => p._id !== product?._id
        );
        setRelatedProducts(filtered.slice(0, limit));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      if (response.success && response.wishlist) {
        const productIds = new Set(
          response.wishlist.items?.map(item => item.product?._id || item.product) || []
        );
        setWishlistItems(productIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
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

  const handleToggleWishlist = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      return;
    }

    try {
      const isInWishlist = wishlistItems.has(productId);
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(productId);
        setWishlistItems(prev => new Set([...prev, productId]));
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gold-950 mb-6">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {relatedProducts.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden hover:border-gold-950/50 transition-all duration-300 group"
          >
            <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.slug)}>
              <div className="relative aspect-square bg-darkGreen-950">
                <FirebaseImage
                  src={
                    (item.images && item.images.length > 0 && item.images[0]) ||
                    item.thumbnail ||
                    'https://images8.alphacoders.com/109/1095996.jpg'
                  }
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.discount}% OFF
                  </span>
                )}
                {item.isBestSeller && (
                  <span className="absolute bottom-2 left-2 bg-gold-950 text-darkGreen-950 text-[10px] font-semibold px-2 py-0.5 rounded">
                    BESTSELLER
                  </span>
                )}
                {item.isNewArrival && !item.isBestSeller && (
                  <span className="absolute bottom-2 left-2 bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    NEW ARRIVAL
                  </span>
                )}
                <button
                  onClick={(e) => handleToggleWishlist(item._id, e)}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlistItems.has(item._id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-700'
                    }`}
                  />
                </button>
              </div>
            </Link>

            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-gold-950 text-gold-950" />
                ))}
                <span className="text-[11px] text-gray-400 ml-1">
                  ({(() => {
                    const base = (item._id || item.slug || '').toString();
                    let hash = 0;
                    for (let i = 0; i < base.length; i++) {
                      hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
                    }
                    return (hash % 91) + 10;
                  })()})
                </span>
              </div>

              <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.slug)}>
                <h3 className="font-semibold text-gray-200 mb-1 line-clamp-2 text-sm hover:text-gold-950 transition-colors">
                  {item.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm font-bold text-gold-950">{getProductPrice(item)}</p>
                  {item.compareAtPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      Rs. {item.compareAtPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => handleAddToCart(item, e)}
                  className="p-2 bg-gold-950 text-darkGreen-950 rounded-lg hover:bg-gold-600 transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

