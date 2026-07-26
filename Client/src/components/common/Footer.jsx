import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { 
      aria: 'Facebook', 
      url: 'https://facebook.com',
      hoverColor: 'hover:bg-blue-600 hover:border-blue-500',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      )
    },
    { 
  aria: 'GitHub', 
  url: 'https://github.com',
  hoverColor: 'hover:bg-slate-800 hover:border-slate-700',
  icon: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.008.069-.008 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
},
    { 
      aria: 'LinkedIn', 
      url: 'https://linkedin.com',
      hoverColor: 'hover:bg-blue-700 hover:border-blue-600',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    { 
      aria: 'Instagram', 
      url: 'https://instagram.com',
      hoverColor: 'hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 hover:border-transparent',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    }
  ];

  const quickLinks = [
    {name:'Home', path:"/"},
    {name:'About Us', path:'/aboutus'},
    {name:'Doctors', path:'/book'}, 
    {name:'Contact', path:'/sale'}];
  const supportLinks = [
    {name:'Help Center', path:'/help'}, 
    {name:'FAQs', path:'/FAQ'},
    {name:'Terms of Service', path:'terms of service'},
    {name:'Privacy Policy', path:'privacy policy'}];

  return (
    <footer className="bg-slate-950 text-gray-400 pt-16 pb-6 px-8 md:px-24 text-xs font-medium">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        
        {/* Brand Section */}
        <div className="col-span-2">
          <h3 className="text-white text-red-500 text-base font-black tracking-wider mb-4">Hospital,<p className='text-blue-500'>Care</p></h3>
          <p className="text-gray-400 leading-relaxed max-w-xs mb-4 text-[11px] opacity-80">
            Your trusted digital Hospital Care built for Better Health Consultant and Online Appointment Booking for Checkup with Specialized Doctor.
          </p>
          
          {/* Social Links Layout Area */}
          <div className="flex gap-3">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx} 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.aria}
                className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center transition-all duration-300 ${social.hoverColor}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 opacity-80">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="hover:text-white transition block py-0.5">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Support Links */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-wider">Support</h4>
          <ul className="space-y-2.5 opacity-80">
            {supportLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="hover:text-white transition block py-0.5">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-wider">Contact Us</h4>
          <ul className="space-y-2.5 opacity-80">
            <li>
              <span role="img" aria-label="phone">📞</span> +977 9821005569
            </li>
            <li>
              <span role="img" aria-label="email">📧</span> HospitalCare@gmail.com
            </li>
            <li className="leading-relaxed">
              <span role="img" aria-label="location">📍</span> Butwal, Rupendehi, Nepal
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between text-gray-500 text-[11px]">
        <p>© 2026 eBooks. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Use</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer