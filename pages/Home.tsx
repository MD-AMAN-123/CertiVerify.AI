import React from 'react';
import { Shield, Award, Search, FileCheck, Users, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Users,
      title: "User Roles & Auth",
      description: "Secure admin and student portals with dedicated access controls."
    },
    {
      icon: FileCheck,
      title: "Bulk Data Management",
      description: "Upload student data via Excel/CSV and manage records efficiently."
    },
    {
      icon: Award,
      title: "Auto-Generation",
      description: "Instantly generate professional certificates with one click."
    },
    {
      icon: Search,
      title: "Instant Verification",
      description: "Verify certificate authenticity using unique IDs or AI analysis."
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "Encrypted data handling ensuring privacy and integrity."
    },
    {
      icon: Shield,
      title: "AI-Powered",
      description: "Leverage Gemini AI for data cleaning and fraud detection."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              CertiVerify <span className="text-blue-200">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
              The next-generation certificate management system. Secure, automated, and intelligent.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => onNavigate('search')}
                className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Search size={20} /> Verify Certificate
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="bg-blue-600 border-2 border-blue-400 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-500 transition-all transform hover:scale-105"
              >
                Admin Login
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose CertiVerify?</h2>
          <p className="text-gray-500 mt-4">Built for educational institutions and certification bodies.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your certification process?</h2>
          <p className="text-gray-400 mb-8">Join hundreds of institutions trusting CertiVerify AI for their credential management.</p>
          <button 
            onClick={() => onNavigate('login')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};
