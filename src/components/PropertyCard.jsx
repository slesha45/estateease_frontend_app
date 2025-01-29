import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { addToWishlistApi, getUserWishlistApi, removeFromWishlistApi, getReviewsApi } from '../apis/Api';
import { toast } from 'react-toastify';
import Rating from 'react-rating-stars-component';

const PropertyCard = ({ propertyInformation, color, updateWishlist }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const res = await getUserWishlistApi();
        const wishlist = res.data.data;
        const isPropertyInWishlist = wishlist.some(property => property._id === propertyInformation._id);
        setIsInWishlist(isPropertyInWishlist);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching wishlist');
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await getReviewsApi(propertyInformation._id);
        const reviews = res.data.reviews;
        calculateAverageRating(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const calculateAverageRating = (reviews) => {
      if (reviews.length === 0) {
        setAverageRating(0);
        return;
      }
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / reviews.length);
    };

    checkWishlistStatus();
    fetchReviews();
  }, [propertyInformation._id]);

  const handleWishlistToggle = async () => {
    setError(null);
    try {
      if (isInWishlist) {
        await removeFromWishlistApi(propertyInformation._id);
        toast.success("Property removed from wishlist");
      } else {
        await addToWishlistApi(propertyInformation._id);
        toast.success("Property added to wishlist");
      }

      setIsInWishlist(!isInWishlist);
      updateWishlist();
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="card" style={{ width: '18rem' }}>
      <span
        style={{
          backgroundColor: color
        }}
        className="badge position-absolute top-0"
      >
        {propertyInformation.propertyCategory}
      </span>
      <img
        src={`https://localhost:5000/property/${propertyInformation.propertyImage}`}
        className="card-img-top"
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        alt="property"
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">{propertyInformation.propertyTitle}</h5>
          <button 
            style={{background: 'none', border: 'none'}}
            onClick={handleWishlistToggle}
          >
            <FaHeart color={isInWishlist ? 'red' : 'grey'}/>    
          </button>
        </div>
        <p className="card-text">{propertyInformation.propertyLocation.slice(0, 30)}</p>
        <h5 className="card-title text-danger"> Rs {propertyInformation.propertyPrice}</h5>
        <div className="rating">
          <Rating
            value={averageRating}
            edit={false}
            size={24}
            activeColor="#ffd700"
          />
          <p>{averageRating.toFixed(1)} out of 5 stars</p>
        </div>
        <Link
          to={`/homepage/view/${propertyInformation._id}`}
          className="btn btn-outline-dark w-100"
        >
          View more
        </Link>
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default PropertyCard;
