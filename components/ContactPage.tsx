import React from 'react';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER, BUSINESS_NAME } from '../constants';
import Breadcrumbs from './Breadcrumbs';

// Importar variantes de animación
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  viewportConfig
} from '../utils/animations';

// otras animaciones
const infoItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.4
    }
  })
};

const socialIconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5 + index * 0.1,
      type: "spring",
      stiffness: 300
    }
  })
};

const ContactPage: React.FC = () => {

    const generateWhatsAppMessage = () => {
        const message = `¡Hola ${BUSINESS_NAME}! Me gustaría cotizar un pedido especial para un evento.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    const crumbs = [
        { label: 'Inicio', link: '/' },
        { label: 'Contacto' }
    ];

    // Datos de contacto
    const contactInfo = [
        {
            icon: "location_on",
            label: "Dirección",
            content: "Av. Siempreviva 742, Springfield",
            type: "text"
        },
        {
            icon: "phone",
            label: "Teléfono",
            content: "(123) 456-7890",
            type: "tel",
            href: "tel:+521234567890"
        },
        {
            icon: "mail",
            label: "Email",
            content: "hola@canela.com",
            type: "email",
            href: "mailto:hola@canela.com"
        }
    ];

    // horarios
    const schedule = [
        { day: "Lunes a Sábado:", hours: "9am - 8pm" },
        { day: "Domingo:", hours: "Cerrado" }
    ];

    // redes sociales
    const socialMedia = [
        {
            name: "WhatsApp",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
            href: `https://wa.me/${WHATSAPP_NUMBER}`
        },
        {
            name: "Instagram",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
            href: "#"
        },
        {
            name: "Facebook",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
            href: "#"
        }
    ];

    return (
        <motion.div 
            className="bg-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container mx-auto px-4 py-6 md:py-12">
                <Breadcrumbs crumbs={crumbs} />
                
                {/* HERO*/}
                <motion.div 
                    className="text-center max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-serif-display text-4xl md:text-5xl font-bold">
                        Endulza tu día, estamos aquí para ti
                    </h2>
                    <motion.p 
                        className="mt-4 text-lg text-text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Si tienes alguna pregunta, deseas hacer un pedido especial o simplemente quieres saludarnos, no dudes en contactarnos. ¡Nos encanta saber de nuestros clientes!
                    </motion.p>
                </motion.div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
                    {/* COLUMNA INFORMACIÓN */}
                    <motion.div 
                        className="md:col-span-2 space-y-8"
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* mapa y dirección */}
                        <div>
                            <motion.h3 
                                className="font-serif-display text-2xl font-bold mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Visítanos
                            </motion.h3>
                            
                            <motion.div 
                                className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.593339943482!2d-99.1686338855955!3d19.43260774542155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f8d39f7a55c5%3A0x8a7a9a8a7a9a8a7a!2sEl%20%C3%81ngel%20de%20la%20Independencia!5e0!3m2!1ses-419!2smx!4v1628797919871!5m2!1ses-419!2smx" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={false}
                                    loading="lazy"
                                    title="Ubicación de Pastelería Canela"
                                ></iframe>
                            </motion.div>
                            
                            <div className="mt-4 space-y-3 text-text-secondary">
                                {contactInfo.map((item, index) => (
                                    <motion.div 
                                        key={item.label}
                                        className="flex items-start gap-3"
                                        custom={index}
                                        variants={infoItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.span 
                                            className="material-symbols-outlined text-secondary mt-1"
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item.icon}
                                        </motion.span>
                                        {item.href ? (
                                            <motion.a 
                                                href={item.href} 
                                                className="hover:text-text-primary transition-colors"
                                                whileHover={{ x: 2 }}
                                            >
                                                {item.content}
                                            </motion.a>
                                        ) : (
                                            <p>{item.content}</p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        
                        {/* horarios */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h3 className="font-serif-display text-2xl font-bold mb-4">
                                Horarios de Atención
                            </h3>
                            <ul className="space-y-2 text-text-secondary">
                                {schedule.map((item, index) => (
                                    <motion.li 
                                        key={item.day}
                                        className="flex justify-between"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                    >
                                        <span>{item.day}</span>
                                        <span className="font-medium text-text-primary">
                                            {item.hours}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                        
                        {/* redes sociales */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <h3 className="font-serif-display text-2xl font-bold mb-4">
                                Síguenos
                            </h3>
                            <div className="flex gap-5">
                                {socialMedia.map((social, index) => (
                                    <motion.a 
                                        key={social.name}
                                        href={social.href} 
                                        aria-label={social.name} 
                                        className="text-secondary hover:text-text-primary transition-colors"
                                        custom={index}
                                        variants={socialIconVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ 
                                            scale: 1.2,
                                            rotate: 5
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* PEDIDOS ESPECIALES*/}
                    <motion.div 
                        className="md:col-span-3"
                        variants={fadeInLeft}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div 
                            className="bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col"
                            whileHover={{ 
                                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.h3 
                                className="font-serif-display text-3xl font-bold mb-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Pedidos Especiales y Eventos
                            </motion.h3>
                            
                            <motion.div 
                                className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.img 
                                    src="https://picsum.photos/seed/eventcake/800/600" 
                                    alt="Pastel para eventos especiales" 
                                    className="w-full h-full object-cover" 
                                    loading="lazy"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                />
                            </motion.div>
                            
                            <div className="space-y-4 text-text-secondary flex-grow">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    ¿Planeando una boda, cumpleaños, o cualquier celebración? En Canela, nos especializamos en crear el postre perfecto que hará de tu evento un momento inolvidable.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    Contáctanos para platicar sobre tu idea. Nos encantará asesorarte y diseñar contigo un pastel o una mesa de postres que sorprenda a todos tus invitados.
                                </motion.p>
                            </div>
                            
                                        {/* botón finalizar por WhatsApp */}
                                        <motion.button
                                            onClick={generateWhatsAppMessage}
                                            className="bg-[#25D366] text-white flex w-full items-center justify-center gap-2 rounded-full py-3 px-5 text-base font-bold shadow-lg"
                                            whileHover={{
                                                y: -3,
                                                boxShadow: "0 10px 30px rgba(37, 211, 102, 0.3)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            {/* logo de WhatsApp */}
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                            <span>Finalizar por WhatsApp</span>
                                        </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactPage;