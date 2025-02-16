import React, { useState, useEffect } from 'react';
import './EPIC.css';
import Loading from '../Loading/Loading';

function EPIC() {
    const [epicData, setEpicData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [imageType, setImageType] = useState('natural');

    useEffect(() => {
        fetchAvailableDates();
    }, [imageType]); // Add imageType as a dependency

    const fetchAvailableDates = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/epic/${imageType}/available?api_key=${process.env.REACT_APP_NASA_API_KEY}`);
            if (!response.ok) {
                const errorData = await response.json();// Try to get error details from API
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }
            const data = await response.json();

            if (data && Array.isArray(data)) { // Check if data is valid
                setAvailableDates(data.map(item => item.date)); // Extract dates
                if (data.length > 0) {
                    setSelectedDate(data[0].date); // Access the date property
                }
            } else {
                throw new Error("Invalid data received from API");
            }

        } catch (error) {
            console.error("Error fetching available dates:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchEpicData();
        }
    }, [selectedDate, imageType]);

    const fetchEpicData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/epic/${imageType}/date/${selectedDate}?api_key=${process.env.REACT_APP_NASA_API_KEY}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEpicData(data);
            if (data.length > 0) {
                const imageName = data[0].image;
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10);
                setImageURL(`https://api.nasa.gov/EPIC/archive/${imageType}/${year}/${month}/${day}/png/${imageName}.png?api_key=${process.env.REACT_APP_NASA_API_KEY}`)
            }

        } catch (error) {
            console.error("Error fetching EPIC data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleImageTypeChange = (event) => {
        setImageType(event.target.value);
        setAvailableDates([]);
        setSelectedDate(null);
        setEpicData([]);
        setImageURL(null);
        fetchAvailableDates();
    };

    const imageTypeOptions = [
        { value: 'natural', label: 'Natural Color' },
        { value: 'enhanced', label: 'Enhanced Color' },
    ];

    return (
        <div className="epic-container">
            <h1>EPIC Imagery</h1>

            <div className="filters">
                <label htmlFor="imageType">Image Type:</label>
                <select id="imageType" value={imageType} onChange={handleImageTypeChange}>
                    {imageTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <label htmlFor="date">Date:</label>
                <select id="date" value={selectedDate || ''} onChange={handleDateChange} disabled={!availableDates.length}>
                    {availableDates.length === 0 ? (
                        <option value="">No dates available</option>
                    ) : (
                        availableDates.map((date, index) => (
                            <option key={index} value={date}>
                                {date}
                            </option>
                        ))
                    )}
                </select>
            </div>

            {loading && <Loading />}
            {error && <p className="error">{error}</p>}

            <div className="epic-content">
                {imageURL && (
                    <div className="image-container">
                        <img src={imageURL} alt="EPIC Image" className="epic-image" />
                    </div>
                )}

                {epicData.length > 0 && (
                    <div className="metadata">
                        <h2>Image Metadata</h2>
                        {epicData.map((item, index) => (
                            <div key={index}>
                                <p><strong>Date:</strong> {item.date}</p>
                                <p><strong>Caption:</strong> {item.caption}</p>
                                {item.centroid_coordinates && (
                                    <p>
                                        <strong>Centroid Coordinates:</strong>
                                        Latitude: {item.centroid_coordinates.lat},
                                        Longitude: {item.centroid_coordinates.lon}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EPIC;