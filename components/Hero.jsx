import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Alem Café interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-cormorant font-bold text-white mb-4 tracking-wide">Alem Café</h1>
          <p className="text-xl md:text-2xl text-cafe-beige max-w-2xl mx-auto mb-8">Artisanal coffee • Fresh pastries • Warm hospitality</p>
          <a href="#menu" className="inline-block bg-cafe-gold hover:bg-cafe-brown text-cafe-darkbrown hover:text-white px-8 py-3 rounded-full transition duration-300 font-semibold">Explore Menu</a>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center"><div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" /></div>
      </div>
    </section>
  );
};
export default Hero;