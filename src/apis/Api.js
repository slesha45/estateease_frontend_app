import axios from "axios";

//creating backend Config!
const Api = axios.create({
  baseURL: "https://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data"
  }
})

//make a config for token
const config = {
  headers: {
    'authorization': `bearer ${localStorage.getItem('token')}`
  }
}

const getToken = () => localStorage.getItem('token');
const jsonConfig = {
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

const getConfig = () => ({
  headers: {
      'Authorization': `Bearer ${getToken()}`
  }
});

//Test API

//Register Api
export const registerUserApi = (data) => Api.post('/api/user/create', data)

//Login API
// export const loginUserApi = (data) => Api.post('/api/user/login', data)
export const loginUserApi = (data) => {
  return axios.post("https://localhost:5000/api/user/login", data, {
    // or your actual endpoint
    validateStatus: () => true, 
  });
};

// Add the following function to fetch all users
export const getAllUsersApi = () => Api.get('/api/user/all', getConfig());
 
// New logout API function
export const logoutUserApi = () => Api.post('/api/user/logout', null, getConfig());

// Get user details API
export const getUserDetails = (userId) => Api.get(`/api/user/${userId}`, getConfig());

//create property API
export const createPropertyApi = (data) => Api.post('/api/property/create', data)

//get all property api
export const getAllProperty = () => Api.get('/api/property/get_all_property', config)

//get single property
export const getSingleProperty = (id) => Api.get(`/api/property/get_single_property/${id}`, config)

//delete property
export const deleteProperty = (id) => Api.delete(`/api/property/delete_property/${id}`, config)

//update property
export const updateProperty = (id, data) => Api.put(`/api/property/update_property/${id}`, data, config)

//Get user profile  Api
export const getUserProfileApi = () => Api.get('/api/user/profile', config)

//Update user profile Api
export const updateUserProfileApi = (data) => Api.put('/api/user/profile', data, config)

//forget password
export const forgetPasswordApi = (data) => Api.post('/api/user/forgot_password', data)

//verify otp
export const verifyOtpApi = (data) => Api.post('/api/user/verify_otp', data)

// pagination
export const propertyPagination = (
  page,
  limit,
  searchQuery = "",
  sortOrder = "asc"
) => {
  const query = `?page=${page}&limit=${limit}&q=${searchQuery}&sort=${sortOrder}`;
  return Api.get(`/api/property/pagination${query}`);
};

// get property count
export const getPropertyCount = () => Api.get("/api/property/get_property_count");

//Gets user wishlist
export const getUserWishlistApi = () => Api.get('api/wishlist/all', config);

export const addToWishlistApi = (propertyId) => {
  return Api.post(`/api/wishlist/add`, { propertyId }, config);
};

export const removeFromWishlistApi = (propertyId) => Api.delete( `api/wishlist/remove/${propertyId}`, config);

//bookings

export const getAllBookings = () => Api.get('/api/booking/all_bookings', config)

export const createBooking = (bookingData) => Api.post('/api/booking/bookings', bookingData, config);

export const updateBookingStatus = (updateData) => Api.put('/api/booking/bookings/status', updateData, config)

export const getUserBookings = () => Api.get('/api/booking/mybookings', config); 

export const updatePaymentMethod = (paymentData) => Api.put('/api/booking/bookings/payment', paymentData, config)

export const getAllContacts = () => Api.get('/api/contact/all', config);

//Review Api
export const addReviewApi = (data) => Api.post('/api/rating/add', data, config);

export const getReviewsApi = (propertyId) => Api.get(`/api/rating/property/${propertyId}`);

// http://localhost:5000/test
