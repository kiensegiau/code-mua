"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Fields from './components/Challenges';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';

export default function KhoaHocLive() {
  return (
    <main>
      <Header />
      <HeroSection />
      <Fields />
      <Roadmap />
      <Footer />
    </main>
  );
}

