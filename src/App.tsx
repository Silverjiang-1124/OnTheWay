import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/useStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import GearLibrary from './pages/GearLibrary';
import TripList from './pages/TripList';
import TripForm from './pages/TripForm';
import TripDetail from './pages/TripDetail';
import './style.css';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gear" element={<GearLibrary />} />
            <Route path="/trips" element={<TripList />} />
            <Route path="/trips/new" element={<TripForm />} />
            <Route path="/trips/:id" element={<TripDetail />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
