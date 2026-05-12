// src/pages/Home.jsx
import Hero from '../components/Hero';
import Features from '../components/Features';
import MenuSection from '../components/MenuSection';
import Stats from '../components/Stats';
import AboutLocationContact from '../components/AboutLocationContact';
import Contact from '../components/Contact';
import Newsletter from '../components/Newsletter';
import Gallery from '../components/Gallery';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <MenuSection />
      <Stats />
      <AboutLocationContact />
      <Contact />
      <Newsletter />
      <Gallery />
    </>
  );
};

export default Home;