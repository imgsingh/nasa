const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/apod', async (req, res) => {
  const apiKey = process.env.API_KEY || 'DEMO_KEY'; // Use environment variable or default
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`; // Construct API URL
  console.log(apiUrl)
  try {
    const response = await fetch(apiUrl);  // Make the API call
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse the JSON response
    res.json(data); // Send the data back to the frontend
  } catch (error) {
    console.error("Error fetching APOD data:", error);
    res.status(500).json({ error: 'Failed to fetch APOD data' }); // Send error response
  }
});

// NASA Mars Photos API Route
app.get('/api/marsPhotos/:rover', async (req, res) => {
  const { rover } = req.params;
  const apiKey = process.env.API_KEY || 'DEMO_KEY'; // Access environment variable
  let apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${apiKey}`;

  if (req.query.sol) {
    apiUrl += `&sol=${req.query.sol}`;
  } else if (req.query.earth_date) {
    apiUrl += `&earth_date=${req.query.earth_date}`;
  }

  if (req.query.camera && req.query.camera !== 'all') {
    apiUrl += `&camera=${req.query.camera}`;
  }

  if (req.query.page) {
    apiUrl += `&page=${req.query.page}`;
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Mars photos:", error);
    res.status(500).json({ error: 'Failed to fetch Mars photos' });
  }
});

// NASA Mars Manifest API Route
app.get('/api/manifests/:rover', async (req, res) => {
  const { rover } = req.params;
  const apiKey = process.env.API_KEY || 'DEMO_KEY';
  const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching manifest:", error);
    res.status(500).json({ error: 'Failed to fetch manifest' });
  }
});


const handleApiRequest = async (req, res, apiUrl) => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json(); // Try to get error details from API
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching from ${apiUrl}:`, error);
    res.status(500).json({ error: 'Failed to fetch data' }); // Generic error message
  }
};

// EPIC API Routes
app.get('/api/epic/:imageType/images', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://api.nasa.gov/EPIC/api/${req.params.imageType}/images?api_key=${apiKey}`;
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/epic/:imageType/date/:date', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://api.nasa.gov/EPIC/api/${req.params.imageType}/date/${req.params.date}?api_key=${apiKey}`;
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/epic/:imageType/available', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://api.nasa.gov/EPIC/api/${req.params.imageType}/all?api_key=${apiKey}`; // Use /all for available dates
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/epic/archive/:imageType/:year/:month/:day/png/:imageName.png', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const url = `https://api.nasa.gov/EPIC/archive/${req.params.imageType}/${req.params.year}/${req.params.month}/${req.params.day}/png/${req.params.imageName}.png?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    res.setHeader('Content-Type', response.headers.get('Content-Type'));
    response.body.pipe(res); // Pipe the image stream directly to the response
  } catch (error) {
    console.error("Error proxying EPIC image:", error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});


app.get('/api/asteroids/feed', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${req.query.start_date}&end_date=${req.query.end_date}&api_key=${apiKey}`;
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/asteroids/lookup/:asteroidId', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/${req.params.asteroidId}?api_key=${apiKey}`;
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/asteroids/browse', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`;
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/nasaImages/search', async (req, res) => {
  const apiUrl = `https://images-api.nasa.gov/search?q=${req.query.q}`; // No api_key parameter in the NASA Images API
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/nasaImages/asset/:nasa_id', async (req, res) => {
  const apiUrl = `https://images-api.nasa.gov/asset/${req.params.nasa_id}`; // No api_key parameter
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/nasaImages/metadata/:nasa_id', async (req, res) => {
  const apiUrl = `https://images-api.nasa.gov/metadata/${req.params.nasa_id}`; // No api_key parameter
  return handleApiRequest(req, res, apiUrl);
});

app.get('/api/nasaImages/captions/:nasa_id', async (req, res) => {
  const apiUrl = `https://images-api.nasa.gov/captions/${req.params.nasa_id}`; // No api_key parameter
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json(); // Try to get error details from API
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }
    res.setHeader('Content-Type', response.headers.get('Content-Type')); // Important for correct interpretation
    response.body.pipe(res); // Pipe the response (especially important for video captions which might be large)
  } catch (error) {
    console.error(`Error fetching from ${apiUrl}:`, error);
    res.status(500).json({ error: 'Failed to fetch data' }); // Generic error message
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});