
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import PlayerPage from './pages/PlayerPage';
import BrowsePage from './pages/BrowsePage';
import OngoingPage from './pages/OngoingPage';
import SchedulePage from './pages/SchedulePage';
import GenrePage from './pages/GenrePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/watch/:episodeId" element={<PlayerPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/ongoing" element={<OngoingPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/genre" element={<GenrePage />} />
          <Route path="/genre/:genreId" element={<BrowsePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          {/* Fallback or 404 can go here */}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
