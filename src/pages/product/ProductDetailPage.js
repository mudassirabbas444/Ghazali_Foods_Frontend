import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Share2,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import productService from '../../services/product';
import cartService from '../../services/cart';
import wishlistService from '../../services/wishlist';
import reviewService from '../../services/review';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';
import ReviewForm from '../../components/product/ReviewForm';
import RelatedProducts from '../../components/product/RelatedProducts';
import RecentlyViewed from '../../components/product/RecentlyViewed';
import StockNotification from '../../components/product/StockNotification';
import ProductQuestions from '../../components/product/ProductQuestions';
import ProductBundles from '../../components/product/ProductBundles';
import { addToRecentlyViewed } from '../../utils/recentlyViewed';
import { addToComparison, isInComparison } from '../../utils/productComparison';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [isInCompare, setIsInCompare] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
      fetchReviews();
    }
  }, [slug]);

  useEffect(() => {
    if (product && isAuthenticated) {
      checkWishlist();
      fetchReviews();
    }
  }, [product, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductBySlug(slug);
      if (response.success) {
        setProduct(response.product);
        // Reset selected image when product changes
        setSelectedImage(0);
        if (response.product.variants && response.product.variants.length > 0) {
          setSelectedVariant(response.product.variants[0]);
        }
        // Add to recently viewed
        addToRecentlyViewed(response.product);
        // Check if in comparison
        setIsInCompare(isInComparison(response.product._id));
      }
    } catch (error) {
      toast.error('Product not found');
      navigate(ROUTES.SHOP);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      if (!product?._id) return;
      const response = await reviewService.getReviewsByProduct(product._id);
      if (response.success) {
        const allReviews = response.reviews || [];
        setReviews(allReviews.filter(r => r.isApproved));
        
        // Check if user has a review
        if (isAuthenticated) {
          const response2 = await reviewService.getMyReviews();
          if (response2.success) {
            const myReview = response2.reviews?.find(r => r.product?._id === product._id);
            setUserReview(myReview || null);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await wishlistService.checkWishlist(product._id);
      setIsInWishlist(response.isInWishlist || false);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      setAddingToCart(true);
      const variantWeight = selectedVariant?.weight || 'default';
      await cartService.addToCart(product._id, variantWeight, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to continue');
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      setAddingToCart(true);
      const variantWeight = selectedVariant?.weight || 'default';
      await cartService.addToCart(product._id, variantWeight, quantity);
      toast.success('Added to cart!');
      // Redirect to checkout immediately
      navigate(ROUTES.CHECKOUT);
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(product._id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: url,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddToComparison = () => {
    try {
      addToComparison(product);
      setIsInCompare(true);
      toast.success('Added to comparison');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product?.basePrice || 0;
  };

  const getComparePrice = () => {
    if (selectedVariant && product?.compareAtPrice) {
      return product.compareAtPrice;
    }
    return product?.compareAtPrice || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={ROUTES.SHOP}
            className="text-gray-600 hover:text-orange-600 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-sm">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              <FirebaseImage
                src={
                  (product.images && product.images.length > 0 && product.images[selectedImage]) 
                    || (product.images && product.images.length > 0 && product.images[0])
                    || product.thumbnail
                    || 'https://images8.alphacoders.com/109/1095996.jpg'
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedImage(idx);
                      }
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                      selectedImage === idx ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <FirebaseImage
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {product.averageRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.totalReviews} reviews)
                </span>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {getCurrentPrice().toLocaleString()}
                </span>
                {getComparePrice() && (
                  <span className="text-xl text-gray-500 line-through">
                    Rs. {getComparePrice().toLocaleString()}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-100 text-red-700 text-sm font-semibold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Weight:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedVariant?.weight === variant.weight
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      {variant.weight} - Rs. {variant.price.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Buy Now
                    </>
                  )}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 mx-auto ${isInWishlist ? 'fill-red-500' : ''}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 p-3 rounded-lg border-2 border-gray-300 hover:border-orange-300 transition-colors"
                  title="Share Product"
                >
                  <Share2 className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>

            {/* Stock Notification */}
            {(selectedVariant?.stock === 0 || product?.stock === 0) && (
              <div className="mb-6">
                <StockNotification product={product} variant={selectedVariant} />
              </div>
            )}

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {product.brand && <li><strong>Brand:</strong> {product.brand}</li>}
                {product.origin && <li><strong>Origin:</strong> {product.origin}</li>}
                {product.category && <li><strong>Category:</strong> {product.category.name}</li>}
                {selectedVariant?.stock !== undefined && (
                  <li>
                    <strong>Stock:</strong>{' '}
                    {selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : 'Out of stock'}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reviews ({reviews.length})
            </h2>
          </div>

          {/* Review Form */}
          {isAuthenticated && (
            <div className="mb-8">
              <ReviewForm
                productId={product._id}
                onReviewSubmitted={() => {
                  fetchReviews();
                  fetchProduct(); // Refresh product to update rating
                }}
                existingReview={userReview}
              />
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {(review.user?.fullName || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.user?.fullName || 'Anonymous'}
                        </p>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-green-600">Verified Purchase</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.title && (
                      <span className="font-semibold text-gray-900">{review.title}</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img, idx) => (
                        <FirebaseImage
                          key={idx}
                          src={img}
                          alt={`Review ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>

        {/* Product Questions */}
        <ProductQuestions productId={product._id} />

        {/* Product Bundles */}
        <ProductBundles product={product} />

        {/* Related Products */}
        <RelatedProducts product={product} />

        {/* Recently Viewed */}
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default ProductDetailPage;

