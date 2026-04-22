import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Rocket, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="clay-card max-w-4xl p-12 flex flex-col items-center">
        <div className="w-24 h-24 bg-clay-brand rounded-clay shadow-clay-md flex items-center justify-center mb-8">
            <h1 className="text-white text-4xl font-black">A</h1>
        </div>
        
        <h1 className="text-5xl font-black text-clay-brand mb-4">ARTTU PARTNERS</h1>
        <p className="text-xl text-slate-600 max-w-xl mb-12">
          The ultimate sponsorship management platform. Streamlined, secure, and beautiful.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full">
          {[
            { icon: <ShieldCheck className="w-8 h-8"/>, title: "Secure", desc: "Enterprise grade data protection" },
            { icon: <Rocket className="w-8 h-8"/>, title: "Fast", desc: "Optimized for high performance" },
            { icon: <Users className="w-8 h-8"/>, title: "Collaborative", desc: "Built for team efficiency" }
          ].map((feat, i) => (
            <div key={i} className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-white shadow-clay-sm rounded-2xl flex items-center justify-center text-clay-brand mb-4">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          <Link to="/login" className="clay-button-primary">
            Get Started
          </Link>
          <Link to="/register" className="clay-button-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
