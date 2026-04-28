import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
            <Route path="/trips/:id/edit" element={<TripForm />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="*" element={
              <div className="page">
                <div className="empty-state">
                  <p>页面不存在</p>
                  <p style={{ fontSize: 14, marginTop: 8 }}><Link to="/">返回首页</Link></p>
                </div>
              </div>
            } />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
