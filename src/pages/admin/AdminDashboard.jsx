import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPropertyApi, deleteProperty, getAllBookings, getAllProperty } from "../../apis/Api";
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [property, setProperty] = useState([])
    const [listedPropertiesCount, setListedPropertiesCount] = useState(0);
    const [deletedPropertiesCount, setDeletedPropertiesCount] = useState(0);
    const [bookedPropertiesCount, setBookedPropertiesCount] = useState(0);

    useEffect(() => {
        getAllProperty().then((res) => {
            setProperty(res.data.Property)
            setListedPropertiesCount(res.data.Property.length);
        }).catch((error) => {
            console.log(error)
        })

        getAllBookings().then((res) => {
            setBookedPropertiesCount(res.data.data.length);
        }).catch((error) => {
            console.log(error);
        });
    }, [])

    console.log(property)

    //use state
    const [propertyTitle, setPropertyTitle] = useState('')
    const [propertyPrice, setPropertyPrice] = useState('')
    const [propertyCategory, setPropertyCategory] = useState('')
    const [propertyLocation, setPropertyLocation] = useState('')

    //state for image
    const [propertyImage, setPropertyImage] = useState('')
    const [previewImage, setPreviewImage] = useState('')

    //image upload handler
    const handleImage = (event) => {
        const file = event.target.files[0]
        setPropertyImage(file)//for backend
        setPreviewImage(URL.createObjectURL(file))
    }

    //handle submit
    const handleSubmit = (e) => {
        e.preventDefault()

        //make a form data(text, files)
        const formData = new FormData()
        formData.append('propertyTitle', propertyTitle)
        formData.append('propertyPrice', propertyPrice)
        formData.append('propertyCategory', propertyCategory)
        formData.append('propertyLocation', propertyLocation)
        formData.append('propertyImage', propertyImage)

        //make an API call
        createPropertyApi(formData).then((res) => {
            //For successful api
            if (res.status === 201) {
                toast.success(res.data.message)
            }
        }).catch((error) => {
            //for error status code
            if (error.response) {
                if (error.response.status === 400) {
                    toast.warning(error.response.data.message)
                } else if (error.response.status === 500) {
                    toast.error(error.response.data.message)
                } else {
                    toast.error("Something went wrong!")
                }
            } else {
                toast.error("Something went wrong!")
            }
        })
    }
    //handle delete product
    const handleDelete = (id) => {
        const confirmDialog = window.confirm("Are you sure you want to delete this property?")
        if (confirmDialog) {
            //calling api
            deleteProperty(id).then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message)
                    setDeletedPropertiesCount(deletedPropertiesCount + 1);
                    setListedPropertiesCount(listedPropertiesCount - 1);
                    setProperty(property.filter(property => property._id !== id));
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    toast.error(error.response.data.message)
                }
            })
        }
    }

    return (
        <div>
            <div className="container">
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#postPropertyModal" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}>Post property</button>
                    <div className="modal fade" id="postPropertyModal" tabIndex="-1" aria-labelledby="postPropertyModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="postPropertyModalLabel">  Post Property </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                                </div>
                                <div className="modal-body">
                                    {/* Form content */}
                                    <form>
                                        <label className="mb-3"> Property Title </label>
                                        <input onChange={(e) => setPropertyTitle(e.target.value)} type="text" className="form-control" id="propertyTitle" placeholder="Enter property title" />

                                        <label className="mb-3"> Property Price </label>
                                        <input onChange={(e) => setPropertyPrice(e.target.value)} type="number" className="form-control" id="propertyPrice" placeholder="Enter property price" />

                                        <label className='mt-2'>Choose Category</label>
                                        <select onChange={(e) => setPropertyCategory(e.target.value)} className='form-control'>
                                            <option value="Apartment">Apartment</option>
                                            <option value="House">House</option>
                                            <option value="Flat">Flat</option>
                                            <option value="Land">Land</option>
                                            <option value="Building">Building</option>

                                        </select>

                                        <label className="mb-3"> Property Location </label>
                                        <input onChange={(e) => setPropertyLocation(e.target.value)} type="text" className="form-control" id="propertyLocation" placeholder="Enter property location" />

                                        <label className="mb-3"> Property Image </label>
                                        <input onChange={handleImage} type="file" className="form-control" id="propertyImage" />

                                        {
                                            previewImage && <img src={previewImage} alt='preview image' className='img-fluid rounded mt-2' />
                                        }
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Close </button>
                                    <button onClick={handleSubmit} type="button" className="btn btn-secondary" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}> Post </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row my-4">
                    <div className="col-md-4">
                        <div className="card text-white mb-3" style={{ backgroundColor: '#B6978A', borderColor: '#B6978A' }}>
                            <div className="card-body">
                                <h5 className="card-title">Properties listed:</h5>
                                <p className="card-text">{listedPropertiesCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white mb-3" style={{ backgroundColor: '#A8B3BA', borderColor: '#A8B3BA' }}>
                            <div className="card-body">
                                <h5 className="card-title">Properties booked:</h5>
                                <p className="card-text">{bookedPropertiesCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white mb-3" style={{ backgroundColor: '#EB8885', borderColor: '#EB8885' }}>
                            <div className="card-body">
                                <h5 className="card-title">Properties deleted:</h5>
                                <p className="card-text">{deletedPropertiesCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-6 align-left">
                        <h1>CHOOSE</h1>
                        <h1>YOUR <span style={{ color: '#AB875F' }}>DREAM</span></h1>
                        <h1 style={{ color: '#AB875F' }}>HOME</h1>
                        <p className="mt-2" style={{ color: '#AB875F' }}>Choose the property of your dreams.</p>
                    </div>
                    <div className="col-md-6">
                        <img
                            src="../../assets/images/home.png"
                            className="img-fluid"
                            alt="Dream Home"
                            style={{ maxHeight: '300px' }}
                        />
                    </div>
                </div>

                <h5>Properties listed at <span style={{ color: '#AB875F' }}>Estate Ease</span></h5>

                <table className='table table-bordered border-warning mt-2'>
                    <thead className='table-warning' >
                        <tr>
                            <th>Property Image</th>
                            <th>Property Title</th>
                            <th>Property Price</th>
                            <th>Property Category</th>
                            <th>Property Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            property.map((singleProperty) => (
                                <tr>
                                    <td>
                                        <img
                                            width={"40px"}
                                            height={"40px"}
                                            src={`https://localhost:5000/property/${singleProperty.propertyImage}`}
                                            alt=""
                                        />
                                    </td>
                                    <td>{singleProperty.propertyTitle}</td>
                                    <td>{singleProperty.propertyPrice}</td>
                                    <td>{singleProperty.propertyCategory}</td>
                                    <td>{singleProperty.propertyLocation}</td>

                                    <td>
                                        <Link to={`/admin/dashboard/update/${singleProperty._id}`} className="btn btn-secondary" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}> Edit</Link>
                                        <button onClick={() => handleDelete(singleProperty._id)} className="btn btn-secondary ms-2"> Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default AdminDashboard
