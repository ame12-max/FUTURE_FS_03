import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import Stats from './components/Stats';
import AboutLocationContact from './components/AboutLocationContact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import MenuDetail from './pages/MenuDetail';
import FullMenu from './pages/FullMenu';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MenuSection />
      <Stats />
      <AboutLocationContact />
      <Contact />
      <Newsletter />
      <Gallery />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Background image container */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Overlay to control background image opacity (decrease darkness) */}
      <div className="fixed inset-0 -z-10 bg-black/10" /> {/* Adjust 40 to lower value for more transparency */}
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
          <Route path="/full-menu" element={<FullMenu />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;