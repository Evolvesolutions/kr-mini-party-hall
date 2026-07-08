import Hero from '../components/Hero';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import CheckAvailability from '../components/CheckAvailability';
import GalleryPreview from '../components/GalleryPreview';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <>
      <Hero />
      <Stats />
      <WhyChooseUs />
      <CheckAvailability />
      <GalleryPreview />
      <Testimonials />
    </>
  );
};

export default Home;
