import React, { useState, useEffect } from 'react';
import './MarsPhotos.css';
import Loading from '../Loading/Loading';

function MarsPhotos() {
    const [rover, setRover] = useState('curiosity');
    const [sol, setSol] = useState('');
    const [earthDate, setEarthDate] = useState('');
    const [camera, setCamera] = useState('all');
    const [photos, setPhotos] = useState([]);
    const [manifest, setManifest] = useState(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const cameras = {
        all: 'All Cameras',
        fhaz: 'FHAZ',
        rhaz: 'RHAZ',
        mast: 'MAST',
        chemcam: 'CHEMCAM',
        mahlm: 'MAHLI',
        mardi: 'MARDI',
        navcam: 'NAVCAM',
        pancam: 'PANCAM',
        minites: 'MINITES',
    };

    useEffect(() => {
        fetchManifest();
    }, [rover]);

    const fetchManifest = async () => {
        try {
            const response = await fetch(`/api/manifests/${rover}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setManifest(data.photo_manifest);
        } catch (error) {
            console.error("Error fetching manifest:", error);
            setError(error.message);
        }
    };


    const fetchPhotos = async () => {
        let apiUrl = `/api/marsPhotos/${rover}?api_key=${process.env.REACT_APP_NASA_API_KEY}&page=${page}`;

        if (sol) {
            apiUrl += `&sol=${sol}`;
        } else if (earthDate) {
            apiUrl += `&earth_date=${earthDate}`;
        }

        if (camera !== 'all') {
            apiUrl += `&camera=${camera}`;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPhotos(data.photos || []);
            setError(null);
            setHasSearched(true);
        } catch (error) {
            console.error("Error fetching photos:", error);
            setError(error.message);
            setPhotos([]);
            setHasSearched(true);
        }
    };

    const handleRoverChange = (event) => {
        setRover(event.target.value);
        setSol('');
        setEarthDate('');
        setPhotos([]);
        setPage(1);
    };

    const handleSolChange = (event) => setSol(event.target.value);
    const handleEarthDateChange = (event) => setEarthDate(event.target.value);
    const handleCameraChange = (event) => setCamera(event.target.value);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchPhotos();
    };

    const manifestInfo = manifest != null ? (
        <div className="manifest-info">
            <h2>{manifest.name} Mission Manifest</h2>
            <p><strong>Landing Date:</strong> {manifest.landing_date}</p>
            <p><strong>Launch Date:</strong> {manifest.launch_date}</p>
            <p><strong>Status:</strong> {manifest.status}</p>
            <p><strong>Max Sol:</strong> {manifest.max_sol}</p>
            <p><strong>Max Earth Date:</strong> {manifest.max_date}</p>
            <p><strong>Total Photos:</strong> {manifest.total_photos}</p>
        </div>
    ) : null;

    const pagination = photos.length > 0 || page > 1 ? (
        <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
            <span>Page {page}</span>
            <button onClick={() => handlePageChange(page + 1)}>Next</button>
        </div>
    ) : null;

    return (
        <div className="mars-photos-container">
            <h1>Mars Rover Photos</h1>

            <div className="filters">
                <label htmlFor="rover">Rover:</label>
                <select id="rover" value={rover} onChange={handleRoverChange}>
                    <option value="curiosity">Curiosity</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="spirit">Spirit</option>
                </select>

                <label htmlFor="sol">Sol:</label>
                <input type="number" id="sol" value={sol} onChange={handleSolChange} />

                <label htmlFor="earthDate">Earth Date:</label>
                <input type="date" id="earthDate" value={earthDate} onChange={handleEarthDateChange} />

                <label htmlFor="camera">Camera:</label>
                <select id="camera" value={camera} onChange={handleCameraChange}>
                    {Object.entries(cameras).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>

                <button onClick={fetchPhotos}>Search</button>
            </div>

            {manifestInfo}

            {error && <div className="error-message">{error}</div>}

            <div className="photos-grid">
                {error ? (
                    <p>Error: {error}</p>
                ) : !hasSearched ? (
                    <p>Search for Mars photos to see results.</p>
                ) : photos.length === 0 ? (
                    <p>No records found.</p>
                ) : (
                    photos.map((photo) => (
                        <div key={photo.id} className="photo-item">
                            <img src={photo.img_src} alt={`Mars photo - ${photo.id}`} />
                            <p><strong>Camera:</strong> {photo.camera.name}</p>
                            <p><strong>Sol:</strong> {photo.sol}</p>
                            <p><strong>Earth Date:</strong> {photo.earth_date}</p>
                        </div>
                    ))
                )}
            </div>

            {pagination}
        </div>
    );
}

export default MarsPhotos;