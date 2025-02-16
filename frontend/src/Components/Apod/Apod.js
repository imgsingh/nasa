import { useState, useEffect } from 'react';
import './Apod.css';
import Loading from '../Loading/Loading';

function Apod() {
    const [apodData, setApodData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/apod')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setApodData(data))
            .catch(error => {
                console.error("Error fetching APOD data:", error);
                setError(error.message); // Set the error message to display
            });
    }, []);

    const renderMedia = () => {
        if (apodData.media_type === 'image') {
            return <img src={apodData.url} alt={apodData.title} />;
        } else if (apodData.media_type === 'video') {
            // Check if it's a YouTube video URL
            const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:v\/|embed\/|watch\?v=|shorts\/)?|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
            const youtubeMatch = apodData.url.match(youtubeRegex);

            if (youtubeMatch) {
                const videoId = youtubeMatch[1];
                return (
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                );
            } else {
                return <video src={apodData.url} controls></video>;
            }
        } else {
            return <p>Media type not supported.</p>;
        }
    };

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }

    if (!apodData) {
        return <Loading />;
    }

    return (
        <div className="apod-container">
            <h1 className="apod-title">Astronomy Picture of the Day</h1>
            <h2 className="apod-subtitle">{apodData.title}</h2>
            <div className="apod-media">
                {renderMedia()}
            </div>
            <p className="apod-explanation">{apodData.explanation}</p>
            {apodData.copyright && <p className="apod-copyright">Copyright: {apodData.copyright}</p>}
        </div>
    );
}

export default Apod;