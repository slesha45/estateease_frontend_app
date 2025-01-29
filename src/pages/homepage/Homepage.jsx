import React, { useEffect, useState } from 'react';
import { getPropertyCount, propertyPagination } from '../../apis/Api';
import PropertyCard from '../../components/PropertyCard';
import './Homepage.css';

const Homepage = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [propertyCount, setPropertyCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const limit = 8;

  useEffect(() => {
    fetchPropertyCount();
    fetchProperties(page, searchQuery, sortOrder);
  }, [page, searchQuery, sortOrder]);

  const fetchPropertyCount = async () => {
    try {
      const res = await getPropertyCount();
      const count = res.data.propertyCount;
      setPropertyCount(count);
      setTotalPages(Math.ceil(count / limit));
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching property count');
    }
  };

  const fetchProperties = async (pageNum, query, sort) => {
    try {
      const res = await propertyPagination(pageNum, limit, query, sort);
      setProperties(res.data.property || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching properties');
    }
  };

  const handlePagination = (pageNum) => {
    setPage(pageNum);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setPage(1); // Reset to first page on sort change
  };

  return (
    <div className="container">
      <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/assets/images/carousel1.jpg" className="d-block w-100 carousel-image" alt="..." />
            <div className="carousel-caption d-none d-md-block black-text">
              <h5>Hurry up and buy!</h5>
              <p>Don't miss the golden chance</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/assets/images/carousel2.jpg" className="d-block w-100 carousel-image" alt="..." />
            <div className="carousel-caption d-none d-md-block black-text">
              <h5>Best Rate in the Market!</h5>
              <p>Look at the properties</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/assets/images/carousel3.jpg" className="d-block w-100 carousel-image" alt="..." />
            <div className="carousel-caption d-none d-md-block black-text">
              <h5>Offer offer offer</h5>
              <p>Book flats at best price!</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="row mt-4">
        <div className="col-12 text-left">
          <div className="input-group my-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search Area or Property ID"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="btn btn-secondary" type="button" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="dropdown mb-3">
        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}>
          Sort by
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={() => handleSortOrderChange('asc')}>Price : Low to High</button></li>
          <li><button className="dropdown-item" onClick={() => handleSortOrderChange('desc')}>Price : High to Low</button></li>
        </ul>
      </div>

      <h2 className="mt-2">Look Into <span style={{ color: '#AB875F' }}>Estate Ease</span></h2>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          properties.map((singleProperty) => (
            <div className="col" key={singleProperty._id}>
              <PropertyCard propertyInformation={singleProperty} color={'#AB875F'} />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <nav aria-label="Page navigation" className="mt-8">
        <ul className="pagination justify-content-center mt-3">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePagination(1)} style={{ color: '#AB875F' }}>First</button>
          </li>
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePagination(page - 1)} style={{ color: '#AB875F' }}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePagination(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePagination(page + 1)} style={{ color: '#AB875F' }}>Next</button>
          </li>
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePagination(totalPages)} style={{ color: '#AB875F' }}>Last</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Homepage;
