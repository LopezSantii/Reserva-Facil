import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Gestión de Turnos',
      description: 'Administra horarios y reservas de forma intuitiva',
    },
    {
      icon: Clock,
      title: 'Disponibilidad 24/7',
      description: 'Tus clientes pueden reservar en cualquier momento',
    },
    {
      icon: CreditCard,
      title: 'Pagos Integrados',
      description: 'Cobra señas y gestiona pagos con Stripe',
    },
    {
      icon: Users,
      title: 'Multi-negocio',
      description: 'Gestiona múltiples locales desde un solo panel',
    },
    {
      icon: Zap,
      title: 'Prueba Gratuita',
      description: '14 días gratis para probar todas las funciones',
    },
    {
      icon: Shield,
      title: 'Seguro y Confiable',
      description: 'Tus datos protegidos con la mejor tecnología',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Reserva Fácil - Plataforma de Reservas Online</title>
        <meta name="description" content="La mejor plataforma para gestionar reservas y turnos online. Prueba gratis por 14 días." />
      </Helmet>

      <div className="min-h-screen">
        <nav className="glass-effect fixed top-0 w-full z-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold gradient-text">Reserva Fácil</span>
              </motion.div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Comenzar Gratis
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">Gestiona tus reservas</span>
              <br />
              de forma inteligente
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              La plataforma completa para negocios que quieren optimizar su gestión de turnos y ofrecer la mejor experiencia a sus clientes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
              >
                Prueba Gratis 14 Días
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/search')}
                className="text-lg px-8 py-6"
              >
                Buscar Negocios
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Todo lo que necesitas
              </h2>
              <p className="text-xl text-gray-600">
                Funcionalidades diseñadas para hacer crecer tu negocio
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect p-8 rounded-2xl card-hover"
                >
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect p-12 rounded-3xl"
            >
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                ¿Listo para comenzar?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Únete a cientos de negocios que ya confían en Reserva Fácil
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-12 py-6"
              >
                Comenzar Ahora - Gratis
              </Button>
            </motion.div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-6 w-6" />
              <span className="text-xl font-bold">Reserva Fácil</span>
            </div>
            <p className="text-gray-400">
              © 2025 Reserva Fácil. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;