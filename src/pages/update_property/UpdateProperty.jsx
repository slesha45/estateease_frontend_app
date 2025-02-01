import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleProperty, updateProperty } from '../../apis/Api'
import { toast } from 'react-toastify'

const UpdateProperty = () => {
    //get id from url
    const { id } = useParams()

    //get property infromation (Backend)
    useEffect(() => {
        getSingleProperty(id).then((res) => {
            setPropertyTitle(res.data.property.propertyTitle)
            setPropertyPrice(res.data.property.propertyPrice)
            setPropertyCategory(res.data.property.propertyCategory)
            setPropertyLocation(res.data.property.propertyLocation)
            setOldImage(res.data.property.propertyImage)

        }).catch((error) => {
            console.log(error)
        })
    }, [])

    // fill all the info in each fields

    // make a use state
    const [propertyTitle, setPropertyTitle] = useState('')
    const [propertyPrice, setPropertyPrice] = useState('')
    const [propertyCategory, setPropertyCategory] = useState('')
    const [propertyLocation, setPropertyLocation] = useState('')

    // state for image
    const [propertyNewImage, setPropertyNewImage] = useState(null)
    const [previewNewImage, setPreviewNewImage] = useState(null)
    const [oldImage, setOldImage] = useState('')

    // image upload handler
    const handleImage = (event) => {
        const file = event.target.files[0]
        setPropertyNewImage(file) // for backend
        setPreviewNewImage(URL.createObjectURL(file))
    }

    //update property
    const handleUpdate = (e) => {
        e.preventDefault()

        //make a form data
        const formData = new FormData()
        formData.append('propertyTitle', propertyTitle)
        formData.append('propertyPrice', propertyPrice)
        formData.append('propertyCategory', propertyCategory)
        formData.append('propertyLocation', propertyLocation)

        if (propertyNewImage) {
            formData.append('propertyImage', propertyNewImage)
        }

        //API call
        updateProperty(id, formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message)
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                toast.error(error.response.data.message)
            }
            else if (error.response.status === 400) {
                toast.error(error.response.data.message)
            }
        })
    }

    return (
        <>
            <div className='mt-3 d-flex flex-column align-items-center'>

                <h2>Update property for <span className='text-danger'>{propertyTitle}</span></h2>

                <div className='d-flex gap-3'>
                    <form action="">
                        <label htmlFor="">Property Title</label>
                        <input value={propertyTitle} onChange={(e) => setPropertyTitle(e.target.value)} className='form-control' type="text" placeholder='Enter property title' />

                        <label className='mt-2' htmlFor="">Property Price</label>
                        <input value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className='form-control' type="number" placeholder='Enter property price' />

                        <label className='mt-2'>Property Location</label>
                        <input value={propertyLocation} onChange={(e) => setPropertyLocation(e.target.value)} className='form-control' type="text" placeholder='Enter property location'></input>

                        <label className='mt-2'>Choose Category</label>
                        <select value={propertyCategory} onChange={(e) => setPropertyCategory(e.target.value)} className='form-control'>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Flat">Flat</option>
                            <option value="Land">Land</option>
                            <option value="Building">Building</option>
                        </select>

                        <label className='mt-2'>Choose Property Image</label>
                        <input onChange={handleImage} type="file" className='form-control' />

                        <button onClick={handleUpdate} className="btn btn-secondary w-100 mt-2" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }} >Save Changes</button>

                    </form>
                    <div className='image section'>
                        <h6>Previewing Old Image</h6>
                        <img height={'150px'} width={'300px'} className='image-fluid-rounded-4 object-fit-cover' src={`https://localhost:5000/property/${oldImage}`}></img>

                        {
                            previewNewImage && <>
                                <h6 className='mt-3'>New Image</h6>
                                <img height={'150'} width={'300px'} className='image-fluid-rounded-4 object-fit-cover' src={previewNewImage} alt='' />
                            </>
                        }

                    </div>
                </div>

            </div>
        </>
    )
}

export default UpdateProperty
