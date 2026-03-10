import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gold">Cathy Décor</h3>
            <p className="text-gray-300">
              Spécialiste de la décoration événementielle depuis 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-gold">Navigation</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-gold transition">Accueil</Link></li>
              <li><Link to="/portfolio" className="hover:text-gold transition">Portfolio</Link></li>
              <li><Link to="/services" className="hover:text-gold transition">Services</Link></li>
              <li><Link to="/about" className="hover:text-gold transition">À propos</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-gold">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/marketplace" className="hover:text-gold transition">Marketplace</Link></li>
              <li><Link to="/salles" className="hover:text-gold transition">Salles partenaires</Link></li>
              <li><Link to="/services" className="hover:text-gold transition">Plans personnalisés</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-gold">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📞 +237 675 036 937</li>
              <li>📫 tchuenchecatherine@gmail.com</li>
              <li>📓 Cameroun</li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-700 pt-8 flex items-center justify-between flex-col md:flex-row gap-4">
          <p className="text-gray-400">© 2026 Cathy Décor. Tous droits réservés.</p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold transition"><FiFacebook size={20} /></a>
            <a href="#" className="hover:text-gold transition"><FiInstagram size={20} /></a>
            <a href="#" className="hover:text-gold transition"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-gold transition"><FiLinkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
