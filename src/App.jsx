import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import Stats from './components/Stats';
import AboutLocationContact from './components/AboutLocationContact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Gallery from './components/Gallery';

function App() {
  return (
    <div className="overflow-x-hidden"
       style={{ backgroundImage: "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",objectFit: 'cover', backgroundAttachment: 'fixed', opacity: 0.9 }}>
      <Navbar />
      <Hero />
      <MenuSection />
      <Stats />
      <AboutLocationContact />
      <Newsletter />
      <Gallery />
      <Footer />
    </div>
  );
}
export default App;