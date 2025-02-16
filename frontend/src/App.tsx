import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainComponent from './Components/MainComponent';
import Navbar from './Components/Navbar/Navbar';
import MarsPhotos from './Components/MarsPhotos/MarsPhotos';
import EPIC from './Components/EPIC/EPIC';
import Asteroids from './Components/Asteriods/Asteroids';
import NASAImages from './Components/NASAImages/NASAImages';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/mars-photos" element={<MarsPhotos />} />
          <Route path="/epic" element={<EPIC />} />
          <Route path="/asteroids" element={<Asteroids />} />
          <Route path="/images" element={<NASAImages />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
