import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuDetail from './pages/MenuDetail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import Stats from './components/Stats';
import AboutLocationContact from './components/AboutLocationContact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import Contact from './components/Contact';

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
    <div
      className="overflow-x-hidden min-h-screen"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;