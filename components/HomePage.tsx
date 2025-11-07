import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Mail, GraduationCap, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Navigation } from './Navigation';
import { AuthContextType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

type HomePageProps = {
  authContext: AuthContextType;
};

export function HomePage({ authContext }: HomePageProps) {
  const { user } = authContext;


  return (
    <div className="min-h-screen bg-white">
      <Navigation authContext={authContext} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm">Institut Teknologi Bandung</span>
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Learn Computational Thinking Through Interactive Labs
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-100 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Master problem-solving skills with hands-on challenges designed for ITB students
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/challenges">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Start Practicing
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <motion.div 
                className="aspect-video rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1620748229976-a78c7e0932a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRhdGlvbmFsJTIwdGhpbmtpbmclMjBjb2Rpbmd8ZW58MXx8fHwxNzYxNjQwNTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Computational thinking and coding"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1732115234692-3ee71d5363af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaW5kb25lc2lhfGVufDF8fHx8MTc2MTUwNzc3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="ITB Campus"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-blue-600 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl text-gray-900">About This Virtual Lab</h2>
              </motion.div>
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Virtual Lab: Computational Thinking ITB is an innovative educational platform designed to help Institut Teknologi Bandung (ITB) students develop essential computational thinking skills through interactive challenges and collaborative learning experiences.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Our platform combines Bebras-style challenges with real classroom integration, allowing students to practice problem-solving, algorithm design, pattern recognition, and logical thinking in an engaging environment.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Staff & Organization Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl text-gray-900">Meet the Instructors</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This virtual lab is part of the <span className="text-blue-600">TPB (Tahap Persiapan Bersama) ITB</span> course, 
              taken by all first-year students across faculties to build foundational computational thinking skills.
            </p>
          </motion.div>

          {/* Team Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-6xl mx-auto px-12"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
                slidesToScroll: 3,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {[
                  {
                    name: 'Dr. Rini Anggraini, S.Si., M.Kom.',
                    role: 'Dosen of Kelas 1 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-700',
                  },
                  {
                    name: 'Prof. Dr. Bambang Sutopo, S.T., M.T.',
                    role: 'Dosen of Kelas 2 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    iconBg: 'bg-orange-100',
                    iconColor: 'text-orange-700',
                  },
                  {
                    name: 'Dr. Eng. Siti Aminah, S.T., M.Sc.',
                    role: 'Dosen of Kelas 3 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-700',
                  },
                  {
                    name: 'Ir. Ahmad Fauzi, M.T., Ph.D.',
                    role: 'Dosen of Kelas 4 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-700',
                  },
                  {
                    name: 'Dr. Dewi Purnama Sari, S.Ars., M.T.',
                    role: 'Dosen of Kelas 5 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-pink-50',
                    borderColor: 'border-pink-200',
                    iconBg: 'bg-pink-100',
                    iconColor: 'text-pink-700',
                  },
                  {
                    name: 'Prof. Ir. Hendra Wijaya, M.Sc., Ph.D.',
                    role: 'Dosen of Kelas 6 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-teal-50',
                    borderColor: 'border-teal-200',
                    iconBg: 'bg-teal-100',
                    iconColor: 'text-teal-700',
                  },
                  {
                    name: 'Dr. Rina Kusumawati, S.Si., M.Si.',
                    role: 'Dosen of Kelas 7 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-indigo-50',
                    borderColor: 'border-indigo-200',
                    iconBg: 'bg-indigo-100',
                    iconColor: 'text-indigo-700',
                  },
                  {
                    name: 'Ir. Budi Santosa, M.T., Dr.Eng.',
                    role: 'Dosen of Kelas 8 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-cyan-50',
                    borderColor: 'border-cyan-200',
                    iconBg: 'bg-cyan-100',
                    iconColor: 'text-cyan-700',
                  },
                  {
                    name: 'Dr. Ratna Sari Dewi, S.T., M.Sc.',
                    role: 'Dosen of Kelas 9 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-700',
                  },
                  {
                    name: 'Prof. Dr. Ir. Agus Setiawan, M.T.',
                    role: 'Dosen of Kelas 10 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-700',
                  },
                  {
                    name: 'Dr. Maya Puspita, S.Kom., M.T.',
                    role: 'Dosen of Kelas 11 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-violet-50',
                    borderColor: 'border-violet-200',
                    iconBg: 'bg-violet-100',
                    iconColor: 'text-violet-700',
                  },
                  {
                    name: 'Ir. Yudi Prasetyo, M.Sc., Ph.D.',
                    role: 'Dosen of Kelas 12 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-fuchsia-50',
                    borderColor: 'border-fuchsia-200',
                    iconBg: 'bg-fuchsia-100',
                    iconColor: 'text-fuchsia-700',
                  },
                  {
                    name: 'Dr. Lestari Handayani, S.Si., M.Si.',
                    role: 'Dosen of Kelas 13 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-sky-50',
                    borderColor: 'border-sky-200',
                    iconBg: 'bg-sky-100',
                    iconColor: 'text-sky-700',
                  },
                  {
                    name: 'Prof. Ir. Darmawan Putra, M.T., Ph.D.',
                    role: 'Dosen of Kelas 14 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-700',
                  },
                  {
                    name: 'Dr. Eng. Novita Rahayu, S.T., M.Sc.',
                    role: 'Dosen of Kelas 15 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-lime-50',
                    borderColor: 'border-lime-200',
                    iconBg: 'bg-lime-100',
                    iconColor: 'text-lime-700',
                  },
                  {
                    name: 'Ir. Eko Budiman, M.T., Dr.Eng.',
                    role: 'Dosen of Kelas 16 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-700',
                  },
                  {
                    name: 'Dr. Wulan Suryani, S.Kom., M.Kom.',
                    role: 'Dosen of Kelas 17 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-700',
                  },
                  {
                    name: 'Prof. Dr. Ir. Sutrisno Hadi, M.Sc.',
                    role: 'Dosen of Kelas 18 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-stone-50',
                    borderColor: 'border-stone-200',
                    iconBg: 'bg-stone-100',
                    iconColor: 'text-stone-700',
                  },
                  {
                    name: 'Dr. Ayu Lestari, S.Ars., M.Ars.',
                    role: 'Dosen of Kelas 19 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-zinc-50',
                    borderColor: 'border-zinc-200',
                    iconBg: 'bg-zinc-100',
                    iconColor: 'text-zinc-700',
                  },
                  {
                    name: 'Ir. Teguh Wibowo, M.T., Ph.D.',
                    role: 'Dosen of Kelas 20 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-neutral-50',
                    borderColor: 'border-neutral-200',
                    iconBg: 'bg-neutral-100',
                    iconColor: 'text-neutral-700',
                  },
                  {
                    name: 'Dr. Sri Mulyani, S.Si., M.Si.',
                    role: 'Dosen of Kelas 21 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-slate-50',
                    borderColor: 'border-slate-200',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-700',
                  },
                  {
                    name: 'Prof. Ir. Wahyu Hidayat, M.Sc., Dr.Eng.',
                    role: 'Dosen of Kelas 22 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-700',
                  },
                  {
                    name: 'Dr. Fitri Yanti, S.T., M.T.',
                    role: 'Dosen of Kelas 23 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    iconBg: 'bg-orange-100',
                    iconColor: 'text-orange-700',
                  },
                  {
                    name: 'Ir. Arief Rahman, M.Kom., Ph.D.',
                    role: 'Dosen of Kelas 24 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-700',
                  },
                  {
                    name: 'Dr. Endah Purwanti, S.Si., M.Sc.',
                    role: 'Dosen of Kelas 25 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-700',
                  },
                  {
                    name: 'Prof. Dr. Hadi Susanto, S.T., M.T.',
                    role: 'Dosen of Kelas 26 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-pink-50',
                    borderColor: 'border-pink-200',
                    iconBg: 'bg-pink-100',
                    iconColor: 'text-pink-700',
                  },
                  {
                    name: 'Dr. Eng. Putri Maharani, S.T., M.Sc.',
                    role: 'Dosen of Kelas 27 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-teal-50',
                    borderColor: 'border-teal-200',
                    iconBg: 'bg-teal-100',
                    iconColor: 'text-teal-700',
                  },
                  {
                    name: 'Ir. Gunawan Pratama, M.T., Dr.Eng.',
                    role: 'Dosen of Kelas 28 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-indigo-50',
                    borderColor: 'border-indigo-200',
                    iconBg: 'bg-indigo-100',
                    iconColor: 'text-indigo-700',
                  },
                  {
                    name: 'Dr. Ika Rahmawati, S.Ars., M.Ars.',
                    role: 'Dosen of Kelas 29 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-cyan-50',
                    borderColor: 'border-cyan-200',
                    iconBg: 'bg-cyan-100',
                    iconColor: 'text-cyan-700',
                  },
                  {
                    name: 'Prof. Ir. Joko Widodo, M.Sc., Ph.D.',
                    role: 'Dosen of Kelas 30 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-700',
                  },
                  {
                    name: 'Dr. Nur Azizah, S.Kom., M.T.',
                    role: 'Dosen of Kelas 31 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-700',
                  },
                  {
                    name: 'Ir. Kurnia Setiawan, M.T., Ph.D.',
                    role: 'Dosen of Kelas 32 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-violet-50',
                    borderColor: 'border-violet-200',
                    iconBg: 'bg-violet-100',
                    iconColor: 'text-violet-700',
                  },
                  {
                    name: 'Dr. Indah Permatasari, S.Si., M.Si.',
                    role: 'Dosen of Kelas 33 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-fuchsia-50',
                    borderColor: 'border-fuchsia-200',
                    iconBg: 'bg-fuchsia-100',
                    iconColor: 'text-fuchsia-700',
                  },
                  {
                    name: 'Prof. Dr. Ir. Andi Wijaya, M.T.',
                    role: 'Dosen of Kelas 34 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-sky-50',
                    borderColor: 'border-sky-200',
                    iconBg: 'bg-sky-100',
                    iconColor: 'text-sky-700',
                  },
                  {
                    name: 'Dr. Eng. Sari Dewi, S.T., M.Sc.',
                    role: 'Dosen of Kelas 35 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-700',
                  },
                  {
                    name: 'Ir. Hari Santoso, M.Kom., Dr.Eng.',
                    role: 'Dosen of Kelas 36 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-lime-50',
                    borderColor: 'border-lime-200',
                    iconBg: 'bg-lime-100',
                    iconColor: 'text-lime-700',
                  },
                  {
                    name: 'Dr. Mega Wulandari, S.Ars., M.T.',
                    role: 'Dosen of Kelas 37 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-700',
                  },
                  {
                    name: 'Prof. Ir. Taufik Hidayat, M.Sc., Ph.D.',
                    role: 'Dosen of Kelas 38 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-700',
                  },
                  {
                    name: 'Dr. Lina Marlina, S.T., M.T.',
                    role: 'Dosen of Kelas 39 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-stone-50',
                    borderColor: 'border-stone-200',
                    iconBg: 'bg-stone-100',
                    iconColor: 'text-stone-700',
                  },
                  {
                    name: 'Ir. Fajar Nugroho, M.T., Ph.D.',
                    role: 'Dosen of Kelas 40 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-zinc-50',
                    borderColor: 'border-zinc-200',
                    iconBg: 'bg-zinc-100',
                    iconColor: 'text-zinc-700',
                  },
                  {
                    name: 'Dr. Retno Sari, S.Si., M.Sc.',
                    role: 'Dosen of Kelas 41 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-neutral-50',
                    borderColor: 'border-neutral-200',
                    iconBg: 'bg-neutral-100',
                    iconColor: 'text-neutral-700',
                  },
                  {
                    name: 'Prof. Dr. Ir. Bambang Hermanto, M.T.',
                    role: 'Dosen of Kelas 42 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-slate-50',
                    borderColor: 'border-slate-200',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-700',
                  },
                  {
                    name: 'Dr. Eng. Ani Suryani, S.T., M.Sc.',
                    role: 'Dosen of Kelas 43 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-700',
                  },
                  {
                    name: 'Ir. Dedi Kurniawan, M.Kom., Ph.D.',
                    role: 'Dosen of Kelas 44 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    iconBg: 'bg-orange-100',
                    iconColor: 'text-orange-700',
                  },
                  {
                    name: 'Dr. Yuni Prabowo, S.Ars., M.Ars.',
                    role: 'Dosen of Kelas 45 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-700',
                  },
                  {
                    name: 'Prof. Ir. Heru Santoso, M.Sc., Dr.Eng.',
                    role: 'Dosen of Kelas 46 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-700',
                  },
                  {
                    name: 'Dr. Dwi Anggraini, S.T., M.T.',
                    role: 'Dosen of Kelas 47 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-pink-50',
                    borderColor: 'border-pink-200',
                    iconBg: 'bg-pink-100',
                    iconColor: 'text-pink-700',
                  },
                  {
                    name: 'Ir. Vino Mahendra, M.T., Ph.D.',
                    role: 'Dosen of Kelas 48 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-teal-50',
                    borderColor: 'border-teal-200',
                    iconBg: 'bg-teal-100',
                    iconColor: 'text-teal-700',
                  },
                  {
                    name: 'Dr. Cahya Kusuma, S.Si., M.Si.',
                    role: 'Dosen of Kelas 49 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-indigo-50',
                    borderColor: 'border-indigo-200',
                    iconBg: 'bg-indigo-100',
                    iconColor: 'text-indigo-700',
                  },
                  {
                    name: 'Prof. Dr. Ir. Pramono Adi, M.T.',
                    role: 'Dosen of Kelas 50 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-cyan-50',
                    borderColor: 'border-cyan-200',
                    iconBg: 'bg-cyan-100',
                    iconColor: 'text-cyan-700',
                  },
                  {
                    name: 'Dr. Eng. Lia Susanti, S.T., M.Sc.',
                    role: 'Dosen of Kelas 51 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-700',
                  },
                  {
                    name: 'Ir. Rizki Permana, M.Kom., Dr.Eng.',
                    role: 'Dosen of Kelas 52 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-700',
                  },
                  {
                    name: 'Dr. Nadia Fitriani, S.Ars., M.T.',
                    role: 'Dosen of Kelas 53 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-violet-50',
                    borderColor: 'border-violet-200',
                    iconBg: 'bg-violet-100',
                    iconColor: 'text-violet-700',
                  },
                  {
                    name: 'Prof. Ir. Surya Dharma, M.Sc., Ph.D.',
                    role: 'Dosen of Kelas 54 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-fuchsia-50',
                    borderColor: 'border-fuchsia-200',
                    iconBg: 'bg-fuchsia-100',
                    iconColor: 'text-fuchsia-700',
                  },
                  {
                    name: 'Dr. Evi Rachmawati, S.T., M.T.',
                    role: 'Dosen of Kelas 55 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-sky-50',
                    borderColor: 'border-sky-200',
                    iconBg: 'bg-sky-100',
                    iconColor: 'text-sky-700',
                  },
                  {
                    name: 'Ir. Danu Wicaksono, M.T., Ph.D.',
                    role: 'Dosen of Kelas 56 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-700',
                  },
                  {
                    name: 'Dr. Sinta Maharani, S.Si., M.Sc.',
                    role: 'Dosen of Kelas 57 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-lime-50',
                    borderColor: 'border-lime-200',
                    iconBg: 'bg-lime-100',
                    iconColor: 'text-lime-700',
                  },
                  {
                    name: 'Prof. Dr. Ir. Triawan Munaf, M.T.',
                    role: 'Dosen of Kelas 58 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-700',
                  },
                  {
                    name: 'Dr. Eng. Olivia Putri, S.T., M.Sc.',
                    role: 'Dosen of Kelas 59 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-700',
                  },
                  {
                    name: 'Ir. Gilang Ramadhan, M.Kom., Ph.D.',
                    role: 'Dosen of Kelas 60 (STEI)',
                    icon: GraduationCap,
                    bgColor: 'bg-stone-50',
                    borderColor: 'border-stone-200',
                    iconBg: 'bg-stone-100',
                    iconColor: 'text-stone-700',
                  },
                  {
                    name: 'Dr. Kartika Sari, S.Ars., M.Ars.',
                    role: 'Dosen of Kelas 61 (SAPPK)',
                    icon: GraduationCap,
                    bgColor: 'bg-zinc-50',
                    borderColor: 'border-zinc-200',
                    iconBg: 'bg-zinc-100',
                    iconColor: 'text-zinc-700',
                  },
                  {
                    name: 'Prof. Ir. Wisnu Wardana, M.Sc., Dr.Eng.',
                    role: 'Dosen of Kelas 62 (SITH)',
                    icon: GraduationCap,
                    bgColor: 'bg-neutral-50',
                    borderColor: 'border-neutral-200',
                    iconBg: 'bg-neutral-100',
                    iconColor: 'text-neutral-700',
                  },
                  {
                    name: 'Bramantyo Anggasta, S.Ds., M.Ds.',
                    role: 'Dosen of Kelas 63 (FSRD)',
                    icon: GraduationCap,
                    bgColor: 'bg-violet-50',
                    borderColor: 'border-violet-200',
                    iconBg: 'bg-violet-100',
                    iconColor: 'text-violet-700',
                  },
                  {
                    name: 'Tri Hasdianto, S.Ds., M.Ds.',
                    role: 'Dosen of Kelas 64 (FSRD)',
                    icon: GraduationCap,
                    bgColor: 'bg-fuchsia-50',
                    borderColor: 'border-fuchsia-200',
                    iconBg: 'bg-fuchsia-100',
                    iconColor: 'text-fuchsia-700',
                  },
                  {
                    name: 'Yogie Candra Bhumi, S.Ds., M.Ds.',
                    role: 'Dosen of Kelas 65 (FSRD)',
                    icon: GraduationCap,
                    bgColor: 'bg-sky-50',
                    borderColor: 'border-sky-200',
                    iconBg: 'bg-sky-100',
                    iconColor: 'text-sky-700',
                  },
                  {
                    name: 'Stormy Yudo Prakoso, S.Sn, M.Ds',
                    role: 'Dosen of Kelas 66 (FSRD)',
                    icon: GraduationCap,
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-700',
                  },
                  {
                    name: 'Dr. Bismo Jelantik Joyodiharjo, S.Sn., M.Ds.',
                    role: 'Dosen of Kelas 67 (FSRD)',
                    icon: GraduationCap,
                    bgColor: 'bg-lime-50',
                    borderColor: 'border-lime-200',
                    iconBg: 'bg-lime-100',
                    iconColor: 'text-lime-700',
                  },
                  {
                    name: 'Dr. Muhammad Juliansyah Putra, S.I.P., M.Si.',
                    role: 'Dosen of Kelas 68 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-700',
                  },
                  {
                    name: 'Dr. Liane Okdinawati, S.T, M.T.',
                    role: 'Dosen of Kelas 69 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-700',
                  },
                  {
                    name: 'Akbar Adhi Utama, S.T, M.A.B., Ph.D.',
                    role: 'Dosen of Kelas 70 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-stone-50',
                    borderColor: 'border-stone-200',
                    iconBg: 'bg-stone-100',
                    iconColor: 'text-stone-700',
                  },
                  {
                    name: 'Desy Anisya Farmaciawaty, S.Si., MORM.Sc., Ph.D.',
                    role: 'Dosen of Kelas 71 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-zinc-50',
                    borderColor: 'border-zinc-200',
                    iconBg: 'bg-zinc-100',
                    iconColor: 'text-zinc-700',
                  },
                  {
                    name: 'Dr. Yuanita Handayati, M.S.M.',
                    role: 'Dosen of Kelas 72 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-neutral-50',
                    borderColor: 'border-neutral-200',
                    iconBg: 'bg-neutral-100',
                    iconColor: 'text-neutral-700',
                  },
                  {
                    name: 'Yuliani Dwi Lestari, S.T, MBA, Ph.D.',
                    role: 'Dosen of Kelas 73 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-slate-50',
                    borderColor: 'border-slate-200',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-700',
                  },
                  {
                    name: 'Dr. Eng. Nur Budi Mulyono, S.T, M.T.',
                    role: 'Dosen of Kelas 74 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-700',
                  },
                  {
                    name: 'Novika Candra Astuti, S.T., M.S.M., Ph.D.',
                    role: 'Dosen of Kelas 75 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-700',
                  },
                  {
                    name: 'Jagat Prirayani, S.T., M.Sc., Ph.D.',
                    role: 'Dosen of Kelas 76 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-700',
                  },
                  {
                    name: 'Dr. Gallang Perdhana Dalimunthe, S.E., M.M.',
                    role: 'Dosen of Kelas 77 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    iconBg: 'bg-orange-100',
                    iconColor: 'text-orange-700',
                  },
                  {
                    name: 'Dr. Muhammad Juliansyah Putra, S.I.P., M.Si.',
                    role: 'Dosen of Kelas 78 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-pink-50',
                    borderColor: 'border-pink-200',
                    iconBg: 'bg-pink-100',
                    iconColor: 'text-pink-700',
                  },
                  {
                    name: 'Dr. Valid Hasyimi, S.T., MURP.',
                    role: 'Dosen of Kelas 79 (SBM)',
                    icon: GraduationCap,
                    bgColor: 'bg-indigo-50',
                    borderColor: 'border-indigo-200',
                    iconBg: 'bg-indigo-100',
                    iconColor: 'text-indigo-700',
                  },
                  {
                    name: 'Prof. Ir. Sanggono Adisasmito, M.Sc., Ph.D., IPU, ASEAN Eng.',
                    role: 'Dosen of Kelas 80 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-cyan-50',
                    borderColor: 'border-cyan-200',
                    iconBg: 'bg-cyan-100',
                    iconColor: 'text-cyan-700',
                  },
                  {
                    name: 'Kevin Yonathan, S.T., M.Sc., Ph.D.',
                    role: 'Dosen of Kelas 80 (FTI)',
                    icon: GraduationCap,
                    bgColor: 'bg-cyan-50',
                    borderColor: 'border-cyan-200',
                    iconBg: 'bg-cyan-100',
                    iconColor: 'text-cyan-700',
                  },
                  {
                    name: 'Teddy Tedjakusuma, S.T, M.T, Ph.D.',
                    role: 'Dosen of Kelas 81 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-teal-50',
                    borderColor: 'border-teal-200',
                    iconBg: 'bg-teal-100',
                    iconColor: 'text-teal-700',
                  },
                  {
                    name: 'Peni Astrini Notodarmojo, S.Si., M.Si., PhD',
                    role: 'Dosen of Kelas 81 (FTSL)',
                    icon: GraduationCap,
                    bgColor: 'bg-teal-50',
                    borderColor: 'border-teal-200',
                    iconBg: 'bg-teal-100',
                    iconColor: 'text-teal-700',
                  },
                  {
                    name: 'Ir. Jooned Hendrarsakti, Ph.D.',
                    role: 'Dosen of Kelas 83 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-700',
                  },
                  {
                    name: 'Dr.Eng. Ir. Gea Fardias Mu\'min, S.T., M.T.',
                    role: 'Dosen of Kelas 84 (FTMD)',
                    icon: GraduationCap,
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-700',
                  },
                  {
                    name: 'Dr. apt. Yuda Prasetya Nugraha, S.Farm., M.Si.',
                    role: 'Dosen of Kelas 85 (SF)',
                    icon: GraduationCap,
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-700',
                  },
                  {
                    name: 'Ferry Mukharradi Simatupang, S.Si., M.Si.',
                    role: 'Dosen of Kelas 89 (FMIPA)',
                    icon: GraduationCap,
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-700',
                  },
                ].map((member, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 pl-2 md:pl-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.03, y: -3 }}
                      className="p-1"
                    >
                      <Card className={`${member.bgColor} border ${member.borderColor} h-full`}>
                        <CardContent className="p-5 flex flex-col items-center text-center h-full">
                          <div className={`w-16 h-16 ${member.iconBg} rounded-full flex items-center justify-center mb-3`}>
                            <member.icon className={`w-8 h-8 ${member.iconColor}`} />
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{member.role}</div>
                          <h3 className="text-sm text-gray-900">{member.name}</h3>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl text-gray-900">Get in Touch</h2>
            </div>
            <p className="text-lg text-gray-600">
              Have questions or need help? Reach out to us through the following channels.
            </p>
          </motion.div>

          {/* Contact Information Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm mb-2">For general inquiries</p>
              <a 
                href="mailto:itbvirtuallabofficial@gmail.com" 
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                itbvirtuallabofficial@gmail.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600 text-sm mb-2">Visit us at</p>
              <p className="text-gray-700">
                Institut Teknologi Bandung<br />
                Jl. Ganesha No. 10<br />
                Bandung 40132, Indonesia
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Hours</h3>
              <p className="text-gray-600 text-sm mb-2">Available during</p>
              <p className="text-gray-700">
                Monday - Friday<br />
                08:00 - 17:00 WIB<br />
                <span className="text-sm text-gray-500">(Closed on weekends)</span>
              </p>
            </motion.div>
          </div>

          {/* Additional Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Immediate Help?</h3>
            <p className="text-gray-600 mb-4">
              For technical support or urgent matters, please contact your course instructor or visit the ITB help desk.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="https://www.itb.ac.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                ITB Official Website
              </a>
              <span className="text-gray-300">|</span>
              <a href="https://akademik.itb.ac.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                Academic Portal
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span>Virtual Lab: Computational Thinking ITB</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Institut Teknologi Bandung. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
