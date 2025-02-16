import React, { useState, useEffect } from 'react';

function MainComponent() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello?t=' + Date.now(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res =>
                res.json()
            )
            .then(data =>
                setMessage(data?.message)
            )
            .catch(e =>
                console.log(e)
            );
    }, []);

    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

export default MainComponent;