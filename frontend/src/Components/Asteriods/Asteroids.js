import React, { useState, useEffect } from 'react';
import './Asteroids.css';
import Loading from '../Loading/Loading';
import ScatterPlot from '../ScatterPlot/ScatterPlot';

function Asteroids() {
    const [asteroids, setAsteroids] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [asteroidDetails, setAsteroidDetails] = useState(null); // For Neo Lookup
    const [selectedAsteroidId, setSelectedAsteroidId] = useState(null); // Store selected ID
    const [browseAsteroids, setBrowseAsteroids] = useState([]);
    const [minEndDate, setMinEndDate] = useState('');
    const [maxEndDate, setMaxEndDate] = useState('');
    const [scatterData, setScatteredData] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Calculate max end date (7 days from start date)
        if (startDate) {
            const startDateObj = new Date(startDate);
            const maxEndDateObj = new Date(startDateObj);
            maxEndDateObj.setDate(startDateObj.getDate() + 7);
            const formattedMaxEndDate = maxEndDateObj.toISOString().slice(0, 10); // Format to YYYY-MM-DD
            setMinEndDate(startDateObj.toISOString().slice(0, 10));
            setMaxEndDate(formattedMaxEndDate);
        } else {
            setMinEndDate();
            setMaxEndDate(''); // Clear max end date if start date is cleared
        }
    }, [startDate]); // Recalculate when startDate changes

    const handleEndDateChange = (event) => {
        const selectedEndDate = event.target.value;
        if (selectedEndDate <= maxEndDate) {  // Check against maxEndDate
            setEndDate(selectedEndDate);
        } else {
            alert("End date cannot be more than 7 days after the start date.");
        }
    };

    const fetchAsteroids = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${apiUrl}/api/asteroids/feed?start_date=${startDate}&end_date=${endDate}&api_key=${process.env.REACT_APP_NASA_API_KEY}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Please enter a valid date under 7 days range only!`);
            }

            const data = await response.json();
            setAsteroids(Object.values(data.near_earth_objects).flat());
        } catch (error) {
            console.error('Error fetching asteroids:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAsteroidDetails = async (asteroidId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/asteroids/lookup/${asteroidId}?api_key=${process.env.REACT_APP_NASA_API_KEY}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }
            const data = await response.json();
            setAsteroidDetails(data);
        } catch (error) {
            console.error('Error fetching asteroid details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBrowseAsteroids = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/asteroids/browse?api_key=${process.env.REACT_APP_NASA_API_KEY}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }
            const data = await response.json();
            setBrowseAsteroids(data.near_earth_objects);
        } catch (error) {
            console.error('Error fetching browse asteroids:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartDateChange = (event) => setStartDate(event.target.value);
    //const handleEndDateChange = (event) => setEndDate(event.target.value);

    const handleAsteroidClick = (asteroidId) => {
        setSelectedAsteroidId(asteroidId);
        fetchAsteroidDetails(asteroidId);
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchAsteroids();
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchBrowseAsteroids();
    }, []);

    useEffect(() => {
        setScatteredData(asteroids.map((asteroid) => {
            const missDistance =
                parseFloat(asteroid.close_approach_data[0]?.miss_distance.kilometers);
            const diameter =
                (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
                    asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
                2;
            if (isNaN(missDistance) || isNaN(diameter)) {
                return null; // Skip if data is invalid
            }
            return { missDistance, diameter };
        }).filter(Boolean));
    }, [asteroids])

    return (
        <div className="asteroids-container">
            <h1>Near Earth Asteroids</h1>

            <div className="filters">
                <label htmlFor="startDate">Start Date:</label>
                <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />

                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={minEndDate}
                    max={maxEndDate} // Set the max attribute
                    disabled={!startDate} // Disable if no start date
                />

                <button onClick={fetchAsteroids} disabled={!startDate || !endDate || loading}>
                    Search
                </button>
            </div>

            {loading && <Loading />}
            {error && <p className="error">{error}</p>}

            <div className="main-content">
                <div className="asteroids-lists">
                    {browseAsteroids.length > 0 && (
                        <div className="asteroids-list">
                            <h2>Asteroids (Browse)</h2>
                            <ul>
                                {browseAsteroids.map((asteroid) => (
                                    <li key={asteroid.id} onClick={() => handleAsteroidClick(asteroid.id)}>
                                        {asteroid.name} ({asteroid.neo_reference_id})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {asteroids.length > 0 && (
                        <div className="asteroids-list">
                            <h2>Asteroids (Feed)</h2>
                            <ul>
                                {asteroids.map((asteroid) => (
                                    <li key={asteroid.id} onClick={() => handleAsteroidClick(asteroid.id)}>
                                        {asteroid.name} ({asteroid.neo_reference_id})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="asteroids-irems">

                    <div>
                        {scatterData &&
                            <>
                                <h2>Asteroid Graph (Distance vs Diameter)</h2>
                                <ScatterPlot scatterData={scatterData} />
                            </>
                        }
                    </div>

                    <div>
                        {asteroidDetails &&
                            <>
                                <h2>Asteroid Details (Lookup)</h2>
                                <div className="asteroid-details">
                                    <pre>{JSON.stringify(asteroidDetails, null, 2)}</pre>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Asteroids;