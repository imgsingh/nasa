import React from 'react';
import './Loading.css'; // Create and import a CSS file for styling

function Loading() {
    return (
        <div className="loading-container"> {/* The container for centering */}
            <div className="loading-spinner"></div> {/* The actual spinner */}
            <p className="loading-text">Loading...</p> {/* Optional loading text */}
        </div>
    );
}

export default Loading;