import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiStar, FiGift, FiTrendingUp, FiCheck } from 'react-icons/fi';
import LogoAnimated from '../components/LogoAnimated';
import api from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ events: 0, satisfaction: 0, experience: 0, shipping: 0 });
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const statsRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const portfolioRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  const [statsVisible, setStatsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);

  // Animer les compteurs au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsVisible) {
        setStatsVisible(true);
        animateCounters();
      }
    }, { threshold: 0.3 });

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, [statsVisible]);

  // Observer pour About
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAboutVisible(true);
      }
    }, { threshold: 0.2 });

    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer pour Services
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setServicesVisible(true);
      }
    }, { threshold: 0.2 });

    if (servicesRef.current) observer.observe(servicesRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer pour Portfolio
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPortfolioVisible(true);
      }
    }, { threshold: 0.2 });

    if (portfolioRef.current) observer.observe(portfolioRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer pour Testimonials
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTestimonialsVisible(true);
      }
    }, { threshold: 0.2 });

    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    return () => observer.disconnect();
  }, []);

  // Services data
  const services = [
    {
      id: 1,
      name: 'Mariage',
      image: '/images/services/mariage.png',
      description: 'Services spécialisés pour créer la décoration de votre jour parfait.'
    },
    {
      id: 2,
      name: 'Anniversaire',
      image: '/images/services/anniversaire.png',
      description: 'Décoration festive et élégante pour célébrer vos moments spéciaux.'
    },
    {
      id: 3,
      name: 'Baptême',
      image: '/images/services/bapteme.png',
      description: 'Services délicats et gracieux pour marquer cette belle occasion.'
    },
    {
      id: 4,
      name: 'Funéraires',
      image: '/images/services/funeraires.png',
      description: 'Services respectueux et dignifiés pour les cérémonies funéraires.'
    }
  ];

  // Fetch decorations from portfolio
  useEffect(() => {
    const fetchDecorations = async () => {
      try {
        const response = await api.get('/decorations?limit=100');
        if (response.data && response.data.length > 0) {
          // Limiter à 6 max
          setDecorations(response.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des décorations:', error);
      }
    };
    fetchDecorations();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (decorations.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % decorations.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [decorations.length]);

  // Auto-play services carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  const animateCounters = () => {
    let current = { events: 0, satisfaction: 0, experience: 0, shipping: 0 };
    const target = { events: 500, satisfaction: 99, experience: 15, shipping: 200 };
    const increment = { events: 20, satisfaction: 4, experience: 0.6, shipping: 8 };

    const interval = setInterval(() => {
      if (current.events < target.events) {
        current.events += increment.events;
        if (current.events > target.events) current.events = target.events;
      }
      if (current.satisfaction < target.satisfaction) {
        current.satisfaction += increment.satisfaction;
        if (current.satisfaction > target.satisfaction) current.satisfaction = target.satisfaction;
      }
      if (current.experience < target.experience) {
        current.experience += increment.experience;
        if (current.experience > target.experience) current.experience = target.experience;
      }
      if (current.shipping < target.shipping) {
        current.shipping += increment.shipping;
        if (current.shipping > target.shipping) current.shipping = target.shipping;
      }

      setStats({ ...current });

      if (current.events >= target.events && current.satisfaction >= target.satisfaction &&
          current.experience >= target.experience && current.shipping >= target.shipping) {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Avec Image de Fond Élégante */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background avec dégradé + motif */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1519167758993-e7fbeb59f831?w=1200&h=800&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Overlay dégradé noir */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
          
          {/* Éléments décoratifs animés */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold/10 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-8 left-10 w-72 h-72 bg-gold/10 rounded-full filter blur-3xl animate-blob-delay-1"></div>
        </div>

        {/* Contenu */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Cathy <span className="text-gold">Décor</span>
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-gray-200 animate-fade-in-delay-1">
              Vos événements méritent une décoration
            </p>
            <p className="text-xl md:text-2xl mb-12 text-gold animate-fade-in-delay-2 font-semibold">
              exceptionnelle ✨
            </p>
          </div>

          {/* CTA Buttons avec hover animation */}
          <div className="flex gap-6 justify-center flex-wrap animate-fade-in-delay-3 mb-12">
            <Link 
              to="/portfolio" 
              className="group relative px-8 py-4 bg-gold text-white font-bold rounded-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Découvrir nos réalisations
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              to="/marketplace" 
              className="group px-8 py-4 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-white transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            >
              Commencer une commande
            </Link>
          </div>

        </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
            <div className="w-8 h-12 border-2 border-gold rounded-full flex items-start justify-center pt-2">
              <div className="w-1 h-2 bg-gold rounded-full animate-pulse"></div>
            </div>
          </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="section-gap bg-gray-50">
        <div className="container-custom">
          <div className={`transition-all duration-1000 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in-up">À propos de Cathy Décor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-200 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <p className="text-lg text-gray-700 mb-4 font-medium">
                Depuis 2010, Cathy Décor transforme vos rêves en réalité lors de vos événements.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Avec une équipe passionnée et créative, nous créons des décorationen qui racontent votre histoire.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Chaque événement est unique, et notre satisfaction, c'est celle de nos clients.
              </p>
              <div className="flex flex-col gap-3">
                {['Créativité sans limite', 'Service personnalisé', 'Qualité garantie'].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                      <FiCheck className="text-dark" size={16} />
                    </div>
                    <span className="font-medium text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${aboutVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}`}>
              <LogoAnimated />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-gap bg-gradient-to-r from-dark via-gray-900 to-dark text-white">
        <div className="container-custom">
          <h2 className={`text-4xl font-bold text-center mb-12 transition-all duration-1000 ${statsVisible ? 'opacity-100 animate-fade-in-down' : 'opacity-0'}`}>
            Nos Réalisations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Événements', value: stats.events, suffix: '+', icon: FiTrendingUp },
              { label: 'Satisfaction', value: Math.round(stats.satisfaction), suffix: '%', icon: FiStar },
              { label: 'Années d\'expérience', value: Math.round(stats.experience), suffix: '', icon: FiGift },
              { label: 'Colis livrés', value: stats.shipping, suffix: '+', icon: FiCheck }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className={`group text-center p-8 rounded-lg bg-white/10 backdrop-blur-sm border border-gold/20 hover:border-gold/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                    statsVisible ? `opacity-100 translate-y-0 animate-fade-in-up-delay` : 'opacity-0 translate-y-8'
                  }`}
                  style={statsVisible ? { animationDelay: `${index * 100}ms` } : {}}
                >
                  <div className="mb-4 transform group-hover:scale-120 transition-transform duration-500">
                    <Icon className="text-gold text-5xl mx-auto" />
                  </div>
                  <div className="text-5xl font-bold text-gold mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <p className="text-gray-300 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section ref={servicesRef} className="section-gap">
        <div className="container-custom">
          <h2 className={`text-4xl font-bold text-center mb-12 transition-all duration-1000 ${servicesVisible ? 'opacity-100 animate-fade-in-down' : 'opacity-0'}`}>
            Nos Services
          </h2>
          
          {/* Services Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {services.map((service, index) => {
              // All 4 services are always visible in home
              return (
                <div
                  key={service.id}
                  onClick={() => navigate('/services')}
                  className={`group relative h-80 rounded-lg cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition-all duration-700 transform ${
                    servicesVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  style={servicesVisible ? { transitionDelay: `${index * 50}ms` } : {}}
                >
                  {/* Image Background */}
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <FiArrowRight className="text-white text-3xl" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              to="/services"
              className="inline-block px-8 py-4 bg-dark text-white font-bold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gold"
            >
              Tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section ref={portfolioRef} className="section-gap bg-gray-50">
        <div className="container-custom">
          <h2 className={`text-4xl font-bold text-center mb-12 transition-all duration-1000 ${portfolioVisible ? 'opacity-100 animate-fade-in-down' : 'opacity-0'}`}>
            Nos évènements les mieux notés
          </h2>
          
          {decorations.length > 0 ? (
            <>
              {/* Carousel viewed - show all items but only rotating subset */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {decorations.map((decoration, index) => {
                  // Calculate which items to show (rotating 3-6 items based on carousel)
                  const itemsToShow = Math.min(decorations.length, 6);
                  const visibleRange = 3; // Show 3 items at a time on desktop
                  const offset = currentCarouselIndex % itemsToShow;
                  const displayIndices = Array.from({ length: visibleRange }, (_, i) => (offset + i) % itemsToShow);
                  const isVisible = displayIndices.includes(index);

                  if (!isVisible) return null;

                  const firstImage = decoration.images && decoration.images.length > 0 
                    ? decoration.images[0] 
                    : 'https://via.placeholder.com/400x300?text=Décoration';

                  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                  const imageUrl = firstImage && firstImage.startsWith('http') 
                    ? firstImage 
                    : baseUrl.replace('/api', '') + firstImage;

                  return (
                    <div
                      key={decoration.id}
                      onClick={() => navigate(`/portfolio?highlight=${decoration.id}`)}
                      className={`group relative h-72 rounded-lg cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition-all duration-700 transform ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      {/* Image Background */}
                      <img
                        src={imageUrl}
                        alt={decoration.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          {decoration.name}
                        </h3>
                        <p className="text-sm text-gray-200 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {decoration.shortDescription || decoration.description?.substring(0, 80) || 'Décoration élégante'}
                        </p>
                        <div className="flex gap-2 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <span className="px-3 py-1 bg-gold/80 rounded-full text-xs font-semibold">
                            {decoration.category}
                          </span>
                          {decoration.theme && (
                            <span className="px-3 py-1 bg-sky-light/60 rounded-full text-xs">
                              {decoration.theme}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <FiArrowRight className="text-white text-3xl" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mb-8">
                {decorations.slice(0, Math.min(6, decorations.length)).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCarouselIndex(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === currentCarouselIndex % decorations.length
                        ? 'bg-gold w-8'
                        : 'bg-gray-400 w-2 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement des événements...</p>
            </div>
          )}

          <div className="text-center">
            <Link 
              to="/portfolio"
              className="inline-block px-8 py-4 bg-dark text-white font-bold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gold"
            >
              Voir tout le portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="section-gap">
        <div className="container-custom">
          <h2 className={`text-4xl font-bold text-center mb-12 transition-all duration-1000 ${testimonialsVisible ? 'opacity-100 animate-fade-in-down' : 'opacity-0'}`}>
            Témoignages de Nos Clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Dupont', event: 'Mariage', text: 'Cathy et son équipe ont transformé mon événement. Tout était parfait!' },
              { name: 'Marc Lefevre', event: 'Anniversaire', text: 'Un service exceptionnel, une créativité impressionnante. Je recommande vivement!' },
              { name: 'Émilie Bernard', event: 'Corporate', text: 'Notre événement a dépassé toutes les attentes. Merci Cathy Décor!' }
            ].map((testimonial, i) => (
              <div 
                key={i}
                className={`group bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 border-l-4 border-transparent hover:border-gold transform hover:scale-105 ${
                  testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={testimonialsVisible ? { transitionDelay: `${i * 100}ms` } : {}}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-gold text-lg group-hover:scale-125 transition-transform" style={{ transitionDelay: `${j * 50}ms` }}>⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-dark">{testimonial.name}</p>
                  <p className="text-sm text-gold font-medium">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-gap bg-gray-50">
        <div className="container-custom max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in-down">Questions Fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: 'Combien de temps à l\'avance dois-je commander?', a: 'Nous recommandons de commander au moins 2 semaines avant votre événement pour garantir la disponibilité.' },
              { q: 'Livrez-vous partout en région?', a: 'Oui, nous livrons dans toute la région. Des frais de livraison s\'appliquent selon la distance.' },
              { q: 'Pouvez-vous personnaliser la décoration?', a: 'Absolument! Chaque événement est unique et nous adaptons la décoration à vos souhaits.' },
              { q: 'Quel est votre délai de paiement?', a: '50% à la commande et 50% avant la livraison. Nous acceptons tous les modes de paiement.' }
            ].map((item, i) => (
              <div
                key={i}
                className={`border-l-4 border-gold rounded-r-lg overflow-hidden transition-all duration-500 ${
                  expandedFAQ === i ? 'bg-gold/10' : 'bg-white'
                } shadow-md hover:shadow-lg`}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full p-6 text-left font-bold text-dark hover:text-gold transition-colors flex justify-between items-center group"
                >
                  <span>{item.q}</span>
                  <div className={`transform transition-transform duration-500 ${expandedFAQ === i ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ${
                    expandedFAQ === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-700 border-t border-gold/20">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-gap bg-gradient-to-r from-gold via-gold to-gold/80 text-white">
        <div className="container-custom text-center">
          <div className="animate-fade-in-down">
            <h2 className="text-4xl font-bold mb-6">Prêt à commencer?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto font-medium">
              Transformons votre événement en un souvenir inoubliable avec notre expertise en décoration.
            </p>
          </div>
          <Link 
            to="/marketplace"
            className="inline-block group px-8 py-4 bg-dark text-white font-bold rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-delay-1"
          >
            <span className="flex items-center gap-2">
              Commander maintenant
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
