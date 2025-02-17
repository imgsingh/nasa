import { useState } from 'react';
import './NASAImages.css';

function NASAImages() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetManifest, setAssetManifest] = useState(null);
    const [assetMetadata, setAssetMetadata] = useState(null);
    const [assetCaptions, setAssetCaptions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/nasaImages/search?q=${searchTerm}&api_key=${process.env.REACT_APP_NASA_API_KEY}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }
            const data = await response.json();
            setSearchResults(data.collection.items);
        } catch (error) {
            console.error('Error searching images:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAssetClick = async (nasa_id) => {
        setSelectedAsset(nasa_id);
        setAssetManifest(null);
        setAssetMetadata(null);
        setAssetCaptions(null);
        setLoading(true);
        setError(null);

        try {
            const manifestResponse = await fetch(`${apiUrl}/api/nasaImages/asset/${nasa_id}?api_key=${process.env.REACT_APP_NASA_API_KEY}`);
            if (!manifestResponse.ok) {
                const errorData = await manifestResponse.json();
                throw new Error(`HTTP error! status: ${manifestResponse.status}, details: ${JSON.stringify(errorData)}`);
            }
            const manifestData = await manifestResponse.json();
            setAssetManifest(manifestData);

            const metadataResponse = await fetch(`${apiUrl}/api/nasaImages/metadata/${nasa_id}?api_key=${process.env.REACT_APP_NASA_API_KEY}`);
            if (!metadataResponse.ok) {
                const errorData = await metadataResponse.json();
                throw new Error(`HTTP error! status: ${metadataResponse.status}, details: ${JSON.stringify(errorData)}`);
            }
            const metadataData = await metadataResponse.json();
            setAssetMetadata(metadataData);

            // const captionsResponse = await fetch(`${apiUrl}/api/nasaImages/captions/${nasa_id}?api_key=${process.env.REACT_APP_NASA_API_KEY}`);
            // if (!captionsResponse.ok) {
            //     const errorData = await captionsResponse.json();
            //     throw new Error(`HTTP error! status: ${captionsResponse.status}, details: ${JSON.stringify(errorData)}`);
            // }
            // const captionsData = await captionsResponse.json();
            // setAssetCaptions(captionsData);

        } catch (error) {
            console.error('Error fetching asset details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nasa-images-container">
            <h1>NASA Image and Video Library</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch} disabled={loading}>Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <div className="results">
                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h2>Search Results</h2>
                        <ul>
                            {searchResults.map((item, index) => (
                                <li key={index} onClick={() =>
                                    handleAssetClick(item.data[0].nasa_id)
                                }>
                                    {item.data[0].title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {selectedAsset && (
                    <div className="asset-details">
                        <h2>Asset Details</h2>
                        {assetManifest && (
                            <div>
                                <h3>Image</h3>
                                <img height={'365px'}
                                    alt={assetManifest.collection.href.split('/')[assetManifest.collection.href.split('/').length - 1]}
                                    src={assetManifest.collection.items[1].href} />
                            </div>
                        )}
                        {assetManifest && (
                            <div>
                                <h3>Manifest</h3>
                                <pre>{JSON.stringify(assetManifest, null, 2)}</pre>
                            </div>
                        )}
                        {assetMetadata && (
                            <div>
                                <h3>Metadata</h3>
                                <pre>{JSON.stringify(assetMetadata, null, 2)}</pre>
                            </div>
                        )}
                        {assetCaptions && (
                            <div>
                                <h3>Captions</h3>
                                <pre>{JSON.stringify(assetCaptions, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NASAImages;