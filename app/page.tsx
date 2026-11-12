"use client";

import React, { useState, useEffect, createContext, useContext, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Globe, X, ExternalLink, Play, Send, Menu } from "lucide-react";

// ==========================================
// 1. BRAND ICONS (Clean SVGs)
// ==========================================

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

// ==========================================
// 2. DATA, TYPES & TRANSLATIONS
// ==========================================

type Language = "en" | "ru";
type Theme = "light" | "dark";

const DICT = {
  en: {
    nav: { about: "About", projects: "Projects", services: "What I Do", contact: "Contact" },
    hero: {
      role: "Motion Designer · Video Editor · 3D Artist",
      stats: "18 YEARS · 3+ YEARS EXPERIENCE",
      bio: "I'm Dmitry, a freelance creative focused on creating engaging visuals, dynamic motion and polished video content for creators, brands and digital projects.",
      viewProjects: "View works →",
      contact: "Contact",
      location: "Based in Moscow, Russia",
    },
    contactPopup: {
      btn: "Contact",
      subtitle: "Choose a contact method"
    },
    projects: {
      title: "Selected Works",
      watchVideo: "Watch full video",
      tools: "Software / Tools",
    },
    services: {
      title: "What I Do",
    },
    contact: {
      title: "Project Inquiry",
      sub: "Tell me about your task, budget, and timeline.",
      type: "Content Type",
      budget: "Budget",
      deadline: "Deadline",
      desc: "Project Description",
      method: "Preferred Contact Method",
      submit: "Prepare Request",
      types: ["Video Editing", "Motion Design", "3D", "VFX", "Other"],
      budgets: ["Under $100", "$100–300", "$300–500", "$500+", "Let's discuss"],
      deadlines: ["1–3 days", "1 week", "2 weeks", "Flexible"],
      methods: ["Telegram", "Instagram", "Email", "X / Twitter", "Discord"],
    },
    footer: { role: "Motion Designer · Video Editor · 3D Artist" },
  },
  ru: {
    nav: { about: "Обо мне", projects: "Проекты", services: "Что я делаю", contact: "Связаться" },
    hero: {
      role: "Motion Designer · Video Editor · 3D Artist",
      stats: "18 ЛЕТ · ОПЫТ 3+ ГОДА",
      bio: "Я Дмитрий, креативный фрилансер. Создаю вовлекающий визуал, динамичный моушен и качественный видеоконтент для авторов, брендов и digital-проектов.",
      viewProjects: "Смотреть работы →",
      contact: "Связаться",
      location: "Базируюсь в Москве, Россия",
    },
    contactPopup: {
      btn: "Связаться",
      subtitle: "Выберите удобный способ"
    },
    projects: {
      title: "Мои работы",
      watchVideo: "Смотреть полностью",
      tools: "Софт / Инструменты",
    },
    services: {
      title: "Что я делаю",
    },
    contact: {
      title: "Обсудить проект",
      sub: "Расскажите о задаче, бюджете и сроках.",
      type: "Тип контента",
      budget: "Бюджет",
      deadline: "Сроки",
      desc: "Описание проекта",
      method: "Удобный способ связи",
      submit: "Сформировать заявку",
      types: ["Монтаж видео", "Моушен-дизайн", "3D", "VFX", "Другое"],
      budgets: ["До $100", "$100–300", "$300–500", "От $500", "Нужно обсудить"],
      deadlines: ["1–3 дня", "1 неделя", "2 недели", "Гибкие"],
      methods: ["Telegram", "Instagram", "Email", "X / Twitter", "Discord"],
    },
    footer: { role: "Motion Designer · Video Editor · 3D Artist" },
  },
};

const SERVICES_DATA = [
  {
    image: {
      light: "/services/editing-light.png",
      dark: "/services/editing-dark.png",
    },
    title: {
      en: "Video Editing",
      ru: "Монтаж видео",
    },
    desc: {
      en: "Long-form, short-form, storytelling and cinematic editing.",
      ru: "Длинные и короткие форматы, сторителлинг и кинематографичный монтаж.",
    },
  },
  {
    image: {
      light: "/services/motion-light.png",
      dark: "/services/motion-dark.png",
    },
    title: {
      en: "Motion Design",
      ru: "Моушен-дизайн",
    },
    desc: {
      en: "Motion graphics, typography, animation and visual effects.",
      ru: "Моушен-графика, типографика, анимация и визуальные эффекты.",
    },
  },
  {
    image: {
      light: "/services/3d-light.png",
      dark: "/services/3d-dark.png",
    },
    title: {
      en: "3D",
      ru: "3D",
    },
    desc: {
      en: "Blender-based 3D work, modeling, rendering and CGI.",
      ru: "Сборка сцен в Blender, моделирование, рендер и CGI.",
    },
  },
  {
    image: {
      light: "/services/vfx-light.png",
      dark: "/services/vfx-dark.png",
    },
    title: {
      en: "VFX",
      ru: "VFX",
    },
    desc: {
      en: "Compositing, visual effects and post-production.",
      ru: "Композитинг, визуальные эффекты и постпродакшн.",
    },
  },
];

const CATEGORIES = [
  { id: "main", label: { ru: "Основные", en: "Featured" } },
  { id: "youtube", label: { ru: "YouTube", en: "YouTube" } },
  { id: "shortform", label: { ru: "Рилсы", en: "Shortform" } },
  { id: "gaming", label: { ru: "Игровые", en: "Gaming" } },
  { id: "motion", label: { ru: "Моушн", en: "Motion" } },
  { id: "ads", label: { ru: "Реклама", en: "Advertising" } },
  { id: "3d", label: { ru: "3D", en: "3D" } },
  { id: "vfx", label: { ru: "VFX", en: "VFX" } },
  { id: "edits", label: { ru: "Эдиты", en: "Edits" } },
];

const CATEGORY_STYLES: Record<string, { badge: string; dot: string; active: string; inactive: string }> = {
  main: {
    badge: "bg-black/5 text-black border-black/10 dark:bg-white/10 dark:text-white dark:border-white/10",
    dot: "bg-black dark:bg-white",
    active: "bg-black text-white dark:bg-white dark:text-black",
    inactive: "bg-gray-100/80 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10",
  },
  youtube: {
    badge: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-300 dark:border-red-400/10",
    dot: "bg-red-500",
    active: "bg-red-500 text-white",
    inactive: "bg-red-50/70 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300",
  },
  shortform: {
    badge: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-400/10",
    dot: "bg-orange-500",
    active: "bg-orange-500 text-white",
    inactive: "bg-orange-50/70 text-orange-700 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-300",
  },
  gaming: {
    badge: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-400/10",
    dot: "bg-violet-500",
    active: "bg-violet-500 text-white",
    inactive: "bg-violet-50/70 text-violet-700 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-300",
  },
  motion: {
    badge: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/10",
    dot: "bg-amber-500",
    active: "bg-amber-500 text-white",
    inactive: "bg-amber-50/70 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300",
  },
  ads: {
    badge: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-400/10",
    dot: "bg-pink-500",
    active: "bg-pink-500 text-white",
    inactive: "bg-pink-50/70 text-pink-700 hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-300",
  },
  "3d": {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/10",
    dot: "bg-cyan-500",
    active: "bg-cyan-500 text-white",
    inactive: "bg-cyan-50/70 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300",
  },
  vfx: {
    badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:border-fuchsia-400/10",
    dot: "bg-fuchsia-500",
    active: "bg-fuchsia-500 text-white",
    inactive: "bg-fuchsia-50/70 text-fuchsia-700 hover:bg-fuchsia-100 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
  },
  edits: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/10",
    dot: "bg-emerald-500",
    active: "bg-emerald-500 text-white",
    inactive: "bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
};


const PROJECTS_DATA = [
  {
    id: "30",
    category: "youtube",
    featured: true,
    tag: { ru: "Длинный формат", en: "Long-form" },
    title: "Угадай всех спортсменов! Спортивная Интуиция",
    desc: { 
      ru: "Сделал 20-минутный парт в этом видео (9 камер, 16 петличек)",
      en: "Made a 20‑minute part in this video (9 cameras, 16 loops)."
    },
    tools: ["Premiere Pro"],
    image: "/projects/project-30.jpg",
    url: "https://youtu.be/7mh84aAUHvQ?si=EZ4Zg1Hgdpqs2OoN",
  },
  {
    id: "1",
    category: "youtube",
    featured: true,
    tag: { ru: "Длинный формат", en: "Long-form" },
    title: "ПРОВЕРКА ФОБИЙ! Меня Закопали ЗАЖИВО В ГРОБУ!",
    desc: { 
      ru: "Монтаж выпуска из большого объёма материала с несколькими камерами и петличками: аудио, цветокоррекция, динамика и моушен-вставки.",
      en: "Editing a long-form episode from a large amount of footage with multiple cameras and lavalier microphones: audio, color grading, pacing, and motion graphics."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-1.jpg",
    url: "https://youtu.be/UOk03g1Wcl4?si=Gd7yU5CMsqk-O83a",
  },
  {
    id: "29",
    category: "youtube",
    featured: true,
    tag: { ru: "Подкаст", en: "Podcast" },
    title: "Вошла в ТОП-10 сильнейших математиков мира",
    desc: { 
      ru: "Подкаст в формате живой беседы: динамичное начало, моушн-вставки, которые помогают удерживать внимание слушателей.",
      en: "A podcast in the format of a live conversation: a dynamic intro, motion graphics that help maintain the listeners’ attention."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-29.jpg",
    url: "https://www.youtube.com/watch?v=3kkKnNxy-lA",
  },
  {
    id: "23",
    category: "youtube",
    featured: false,
    tag: { ru: "Тестовое", en: "Test" },
    title: "Test Video for Fitness YouTuber Pavel Tulupa",
    desc: { 
      ru: "Тестовое видео для фитнес-блогера в стиле Джеффа Ниппарда, с акцентом на динамичный монтаж, моушен-графику и подачу материала.",
      en: "A test video for a fitness creator inspired by Jeff Nippard’s style, focused on dynamic editing, motion graphics, and clear visual presentation."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-23.png",
    url: "https://www.youtube.com/watch?v=3kkKnNxy-lA",
  },
  {
    id: "24",
    category: "youtube",
    featured: false,
    tag: { ru: "Длинный формат", en: "Long-form" },
    title: "Я ПОВТОРИЛ МОНТАЖ MrBEAST",
    desc: { 
      ru: "Сделал несколько моушен-партов и 3D-вставок для видео, дополнив монтаж динамичными визуальными элементами.",
      en: "Created several motion graphics sections and 3D inserts, adding dynamic visual elements to the edit."
    },
    tools: ["After Effects", "Blender", "Premiere Pro"],
    image: "/projects/project-24.jpg",
    url: "https://www.youtube.com/watch?v=QOsXgPVR13o",
  },
  {
    id: "26",
    category: "youtube",
    featured: false,
    tag: { ru: "Длинный формат", en: "Long-form" },
    title: "Я СМОГ НАУЧИТЬ ИВАНА ЗОЛО ФОТОШОПУ (или нет...)",
    desc: { 
      ru: "Сделал несколько моушен-партов и 3D-вставок для видео, дополнив монтаж динамичными визуальными элементами.",
      en: "Created several motion graphics sections and 3D inserts, adding dynamic visual elements to the edit."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-26.jpg",
    url: "https://www.youtube.com/watch?v=0zBrLzq5DlM",
  },
  {
    id: "27",
    category: "youtube",
    featured: false,
    tag: { ru: "Длинный формат", en: "Long-form" },
    title: "Купил E-GIRL На Час для ОБЩЕНИЯ | И Девушка На Час в Игре",
    desc: { 
      ru: "Сделал несколько моушен-партов и 3D-вставок для видео, дополнив монтаж динамичными визуальными элементами.",
      en: "Created several motion graphics sections and 3D inserts, adding dynamic visual elements to the edit."
    },
    tools: ["After Effects", "Premiere Pro", "Blender"],
    image: "/projects/project-27.jpg",
    url: "https://youtu.be/V5oYwOWCpG4",
  },
  {
    id: "2",
    category: "ads",
    featured: true,
    tag: { ru: "Рекламный ролик", en: "Ad" },
    title: "HornyBox Advertisement",
    desc: { 
      ru: "Реклама сервиса доната и пополнения игрового баланса в видео блогера Грозный.",
      en: "Advertisement for a gaming top-up service featured in Grozny’s video."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-2.png",
    url: "https://youtu.be/Uqnec1r1BeM?si=nU5xGBPg2EJvArHa",
  },
  {
    id: "9",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "*НА ГЕЙМПАДЕ* СКОЛЬКО ЗА ЧАС ЗАРАБОТАЮ РЕЙТИНГА В ФОРТНАЙТ",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects"],
    image: "/projects/project-9.jpg",
    url: "https://youtu.be/OOyFOq0vCGE?si=EBlmy4mjQvmkg9pk",
  },
  {
    id: "10",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "ИСТОРИЯ СКИНОВ ФОРТНАЙТА С 1 ПО 3 СЕЗОН",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects", "Blender"],
    image: "/projects/project-10.jpg",
    url: "https://www.youtube.com/watch?v=FBvbKzcPMNo",
  },
  {
    id: "11",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "ФОРТНАЙТУ ПОНАДОБИЛОСЬ НА ЭТО 7 ЛЕТ.....",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects", "Blender"],
    image: "/projects/project-11.jpg",
    url: "https://youtu.be/4BAk0ucmoN8?si=4YidXqYLGMyTfAnX",
  },
  {
    id: "12",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "Marvel Спасли 4 Сезон в Фортнайт",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects", "Blender"],
    image: "/projects/project-12.jpg",
    url: "https://www.youtube.com/watch?v=m8tBzgEngow",
  },
  {
    id: "13",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "ОБМЕНЯЛИСЬ КВАРТИРАМИ с ДЖЕНТЛЬМЕНОМ ! ЖИВЕТ С ЕВЖЕНИЕЙ?",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects", "Blender"],
    image: "/projects/project-13.jpg",
    url: "https://youtu.be/L7ui6_sRw8E",
  },
  {
    id: "14",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "НОВЫЙ РАНДОМНЫЙ СКИН ЧЕЛЛЕНДЖ В ФОРТНАЙТ",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects", "Blender"],
    image: "/projects/project-14.jpg",
    url: "https://www.youtube.com/watch?v=FrCTW5AXfHY&t",
  },
  {
    id: "15",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "Я УДАЛИЛ STANDOFF 2 и СКАЧАЛ…",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects", "Blender"],
    image: "/projects/project-15.jpg",
    url: "https://youtu.be/UUcuYB9IuCg",
  },
  {
    id: "4",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "КАК ПРОШЛА НАША ЛИДЕРКА ЯПОНСКОЙ МАФИИ В GTA 5 RP MURRIETA - ТУЛЕВО ГТА 5 РП",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects"],
    image: "/projects/project-4.jpg",
    url: "https://www.youtube.com/watch?v=0oD2Jknrd3o",
  },
  {
    id: "3",
    category: "gaming",
    featured: false,
    tag: { ru: "Игровой выпуск", en: "Gaming episode" },
    title: "ПОЛУЧИЛ ВСЕ УДАЛЁННЫЕ БАЗЫ с помощью лайфхака в Steal a Brainrot!!!",
    desc: { 
      ru: "Разработали динамичные визуальные вставки и аккуратно встроили их в часовой выпуск.",
      en: "Created and integrated dynamic visual motion graphics for a 1-hour gaming episode."
    },
    tools: ["Premiere Pro", "After Effects"],
    image: "/projects/project-3.jpg",
    url: "https://www.youtube.com/watch?v=0oD2Jknrd3o",
  },
  {
    id: "16",
    category: "3d",
    featured: false,
    tag: { ru: "3D / Визуальные эффекты", en: "3D / Visual effects" },
    title: "OG Buda, Платина — 30МИН (Unofficial 3D)",
    desc: {
      ru: "Композитинг, трекинг и добавление CG-элементов для музыкального клипа. 3D cloth & VFX by me, siomcrew production.  ",
      en: "Compositing, tracking and CG element integration for a music video."
    },
    tools: ["Blender", "Marvelous Designer", "Substance Painter", "After Effects"],
    image: "/projects/project-16.jpg",
    url: "https://youtu.be/L5W0roA_i1g?si=ROGhpNKz5MwUbsNk",
  },
  {
    id: "25",
    category: "3d",
    featured: true,
    tag: { ru: "Моделирование / Текстурирование", en: "Modeling / Texturing" },
    title: "3D Room (In Process)",
    desc: { 
      ru: "Полностью смоделированная 3D-комната: от мебели и декора до материалов и текстур. Все модели и текстуры созданы мной с нуля.",
      en: "A fully modeled 3D room, from furniture and decor to materials and textures. All models and textures were created from scratch."
    },
    tools: ["Blender", "Substance Painter", "Photoshop"],
    image: "/projects/project-25.png",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUIcmlja3JvbGygBwE%3D",
  },
  {
    id: "5",
    category: "3d",
    featured: false,
    tag: { ru: "Визуал", en: "Visual" },
    title: "3D Intro for Fortnite Podcast",
    desc: { 
      ru: "3D-интро для Fortnite-подкаста с моделированием, анимацией и динамичной подачей.",
      en: "3D intro for a Fortnite podcast featuring custom modeling, animation, and dynamic visuals."
    },
    tools: ["Blender", "After Effects"],
    image: "/projects/project-5.png",
    url: "https://www.youtube.com/watch?v=x5Eu5ZwJKts",
  },
  {
    id: "28",
    category: "3d",
    featured: false,
    tag: { ru: "Моделирование / Текстурирование", en: "Modeling / Texturing" },
    title: "3D Modeling Shoes",
    desc: { 
      ru: "Полностью смоделированная 3D-комната: от мебели и декора до материалов и текстур. Все модели и текстуры созданы мной с нуля.",
      en: "A fully modeled 3D room, from furniture and decor to materials and textures. All models and textures were created from scratch."
    },
    tools: ["Blender", "Substance Painter", "Photoshop"],
    image: "/projects/project-28.png",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUIcmlja3JvbGygBwE%3D",
  },
  {
    id: "6",
    category: "shortform",
    featured: true,
    tag: { ru: "Рилс / Моушн", en: "Reel / Motion" },
    title: "Expert Reel (Recreate)",
    desc: {
      ru: "Минималистичный монтаж экспертного контента с акцентом на моушен и 3D-графику.",
      en: "Minimalist editing for expert content, with a focus on motion graphics and 3D."
    },
    tools: ["After Effects", "Blender", "Premiere Pro"],
    image: "/projects/project-6.png",
    url: "https://www.youtube.com/shorts/LW4uFKBNCoY",
  },
  {
    id: "27",
    category: "shortform",
    featured: false,
    tag: { ru: "Музыкальные Сторис", en: "Music Stories" },
    title: "Lali Pivo, MOSHITHUG — MATH WRLD DELUXE",
    desc: {
      ru: "Минималистичный монтаж экспертного контента с акцентом на моушен и 3D-графику.",
      en: "Minimalist editing for expert content, with a focus on motion graphics and 3D."
    },
    tools: ["After Effects", "Blender", "Premiere Pro"],
    image: "/projects/project-27.png",
    url: "https://www.youtube.com/shorts/s5gli5-M9T0",
  },
  {
    id: "7",
    category: "edits",
    featured: false,
    tag: { ru: "Эдиты", en: "Edit" },
    title: "Playboi Carti — Poke It Out",
    desc: { 
      ru: "Динамичный моушен-эдит с акцентом на типографику, плавные переходы и выразительную визуальную подачу.",
      en: "A dynamic motion graphics edit focused on typography, smooth transitions, and expressive visuals."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-7.png",
    url: "https://www.youtube.com/watch?v=K72d89ZIm5Y&list=PLpz5woMf3GrAWfu6JTQ9wGKCK_YRszgAR&index=1&pp=gAQBiAQB",
  },
  {
    id: "16",
    category: "vfx",
    featured: true,
    tag: { ru: "3D / Визуальные эффекты", en: "3D / Visual effects" },
    title: "OG Buda, Платина — 30МИН (Unofficial 3D)",
    desc: {
      ru: "Композитинг, трекинг и добавление CG-элементов для музыкального клипа. 3D cloth & VFX by me, siomcrew production.  ",
      en: "Compositing, tracking and CG element integration for a music video."
    },
    tools: ["Blender", "Marvelous Designer", "Substance Painter", "After Effects"],
    image: "/projects/project-16.jpg",
    url: "https://youtu.be/L5W0roA_i1g?si=ROGhpNKz5MwUbsNk",
  },
  {
    id: "8",
    category: "vfx",
    featured: false,
    tag: { ru: "Визуальные эффекты", en: "Visual effects" },
    title: "Ian — Magic Johnson (Unofficial)",
    desc: {
      ru: "Композитинг, трекинг и добавление CG-элементов для музыкального клипа.",
      en: "Compositing, tracking and CG element integration for a music video."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-8.png",
    url: "https://www.youtube.com/watch?v=40FEk5AYGrs",
  },
  {
    id: "17",
    category: "vfx",
    featured: false,
    tag: { ru: "3D / Визуальные эффекты", en: "3D / Visual effects" },
    title: "LILDRUGHILL — трудно простить (Unofficial 3D)",
    desc: {
      ru: "Композитинг, трекинг и добавление CG-элементов для музыкального клипа. 3D cloth & VFX by me, siomcrew production.  ",
      en: "Compositing, tracking and CG element integration for a music video."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-17.png",
    url: "https://www.youtube.com/shorts/IA_c4faSuqs",
  },
  {
    id: "18",
    category: "vfx",
    featured: false,
    tag: { ru: "Визуальные эффекты / 3D", en: "Visual effects / 3D" },
    title: "elyaplugg! — mad!!! (Unofficial)",
    desc: {
      ru: "Композитинг, трекинг и добавление CG-элементов для музыкального клипа. 3D cloth & VFX by me, siomcrew production.  ",
      en: "Compositing, tracking and CG element integration for a music video."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-18.png",
    url: "https://www.youtube.com/watch?v=LwrI03GROgQ",
  },
  {
    id: "19",
    category: "motion",
    featured: false,
    tag: { ru: "Моушн-графика", en: "Motion graphics" },
    title: "Motion Design для онлайн школы «Школково»",
    desc: {
      ru: "Минималистичный монтаж экспертного контента с акцентом на моушен и 3D-графику.",
      en: "Minimalist editing for expert content, with a focus on motion graphics and 3D."
    },
    tools: ["After Effects"],
    image: "/projects/project-19.png",
    url: "https://youtu.be/V6FEpEWNt2o?si=WY0KzpMgK40QCbYJ",
  },
  {
    id: "21",
    category: "ads",
    featured: false,
    tag: { ru: "Рекламный ролик", en: "Ad" },
    title: "DonatovNet Advertisement",
    desc: { 
      ru: "Реклама сервиса доната и пополнения игрового баланса в видео блогера Грозный.",
      en: "Advertisement for a gaming top-up service featured in Grozny’s video."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-21.png",
    url: "https://youtu.be/WD3P8VcQOxs?si=c0DkJCH0OrXvuO4J",
  },
  {
    id: "22",
    category: "ads",
    featured: false,
    tag: { ru: "Рекламный ролик", en: "Ad" },
    title: "Nessa Checker Advertisement",
    desc: { 
      ru: "?",
      en: "?"
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-22.png",
    url: "https://youtu.be/kjR-nrEs-oQ?si=Zg1E2DhLKtWztOaL",
  },
  {
    id: "20",
    category: "ads",
    featured: false,
    tag: { ru: "Рекламный ролик", en: "Ad" },
    title: "Advertisement for Funpay & EroxBlox",
    desc: { 
      ru: "Реклама торговой платформы для игроков в видео блогера EroxBlox.",
      en: "Advertisement for a gaming marketplace featured in EroxBlox’s video."
    },
    tools: ["After Effects", "Premiere Pro"],
    image: "/projects/project-20.png",
    url: "https://www.youtube.com/watch?v=ox4cUYURFtE",
  },
];

const TOOL_LOGOS: Record<string, string> = {
  "Blender": "blender",
  "Marvelous Designer": "marvelousdesigner",
  "Substance Painter": "adobesubstance3d",
  "DaVinci Resolve": "davinciresolve",
  "Davinci Resolve": "davinciresolve",
  "Photoshop": "adobephotoshop",
  "After Effects": "adobeaftereffects",
  "AE": "adobeaftereffects",
  "Premiere Pro": "adobepremierepro",
  "PR": "adobepremierepro",
  "Cinema 4D": "cinema4d",
  "Octane": "octanerender",
  "Nuke": "nuke",
};

const ToolLogo = ({ tool, theme }: { tool: string; theme: Theme }) => {
  const [failed, setFailed] = useState(false);
  const slug = TOOL_LOGOS[tool];
  const fallbackLabel = tool === "After Effects" || tool === "AE" ? "Ae"
    : tool === "Premiere Pro" || tool === "PR" ? "Pr"
    : tool === "Substance Painter" ? "SP"
    : tool === "Marvelous Designer" ? "MD"
    : tool === "DaVinci Resolve" || tool === "Davinci Resolve" ? "DaVinci"
    : tool === "Cinema 4D" ? "C4D"
    : tool === "Blender" ? "B"
    : tool === "Photoshop" ? "Ps"
    : tool === "Octane" ? "O"
    : tool === "Nuke" ? "N"
    : tool.slice(0, 2);

  if (!slug || failed) {
    return <span aria-hidden="true" className="inline-flex w-5 h-5 shrink-0 items-center justify-center rounded bg-gray-200 dark:bg-white/15 text-[8px] font-bold text-gray-700 dark:text-white">{fallbackLabel}</span>;
  }

  // Force a high-contrast monochrome icon; the default CDN SVG can be too dark on dark cards.
  const iconColor = theme === "dark" ? "FFFFFF" : "171717";
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${iconColor}`}
      alt=""
      aria-hidden="true"
      className="w-5 h-5 object-contain shrink-0"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};

// ==========================================
// 3. CONTEXT PROVIDER
// ==========================================

const AppContext = createContext<{
  lang: Language;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: typeof DICT.en;
} | null>(null);

const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("Missing AppContext");
  return ctx;
};

// ==========================================
// 4. COMPONENTS
// ==========================================

const Header = () => {
  const { lang, toggleLang, theme, toggleTheme, t } = useAppContext();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsContactOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setIsContactOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    if (isContactOpen) document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isContactOpen, isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0B0B10]/90 backdrop-blur-md border-b border-gray-200/60 dark:border-white/5 h-[64px]"
      >
        <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between relative">

          {/* LEFT: Logo */}
          <div className="flex items-center gap-3 z-10 w-[200px]">
            <div className="w-[50px] h-[32px] rounded-[10px] flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={theme === "dark" ? "/logos/logo-white.png" : "/logos/logo-black.png"}
                alt="dcq logo"
                onError={(event) => {
                  // If theme-specific assets haven't been added yet, fall back to the original logo.
                  const img = event.currentTarget;
                  if (!img.dataset.fallbackApplied) {
                    img.dataset.fallbackApplied = "true";
                    img.src = "/logos/logo.png";
                    img.style.filter = theme === "dark" ? "brightness(0) invert(1)" : "none";
                  }
                }}
                className="w-full h-full object-contain p-1 translate-x-4.5 translate-y-0.5"
              />
            </div>

            <a
              href="#"
              className="text-xl font-bold tracking-tighter lowercase text-black dark:text-white mt-0.5"
            >
              dcq
            </a>
          </div>

          {/* CENTER: Navigation — exact viewport center */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10 text-sm font-medium text-gray-600 dark:text-gray-400 z-10">
            <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">
              {t.nav.about}
            </a>
            <a href="#projects" className="hover:text-black dark:hover:text-white transition-colors">
              {t.nav.projects}
            </a>
            <a href="#services" className="hover:text-black dark:hover:text-white transition-colors">
              {t.nav.services}
            </a>
          </nav>

          {/* RIGHT: Socials + language + theme + contact */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 z-10 lg:w-[390px]">
            <div className="hidden lg:flex items-center gap-3 text-gray-500 dark:text-gray-400 mr-1">
              <a
                href="https://x.com/madebydcq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="hover:text-black dark:hover:text-white hover:scale-110 transition-all p-1"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/madebydcq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-black dark:hover:text-white hover:scale-110 transition-all p-1"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@madebydcq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-black dark:hover:text-white hover:scale-110 transition-all p-1"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/madebydcq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="hover:text-black dark:hover:text-white hover:scale-110 transition-all p-1"
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </a>
            </div>

            {/* Divider: socials | language */}
            <div className="w-px h-[18px] bg-gray-300 dark:bg-white/10 shrink-0 mx-1" />

            <button
              onClick={toggleLang}
              className="text-[13px] font-bold tracking-wide flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
              aria-label="Change language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
              aria-label="Change theme"
            >
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {/* Divider: theme | contact */}
            <div className="w-px h-[18px] bg-gray-300 dark:bg-white/10 shrink-0 mx-1" />

            <div ref={contactRef} className="relative">
              <button
                type="button"
                onClick={() => setIsContactOpen((open) => !open)}
                aria-expanded={isContactOpen}
                aria-haspopup="dialog"
                className="hidden sm:inline-flex px-5 py-2 text-sm font-semibold text-white bg-black dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
              >
                {t.nav.contact}
              </button>

              <button
                type="button"
                onClick={() => setIsContactOpen((open) => !open)}
                aria-expanded={isContactOpen}
                aria-haspopup="dialog"
                aria-label={t.nav.contact}
                className="sm:hidden w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>

            <AnimatePresence>
              {isContactOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-3 w-[min(300px,calc(100vw-2rem))] bg-white dark:bg-[#12121A] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)] border border-gray-100 dark:border-white/10 p-6 origin-top-right z-[70]"
                >
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{t.contactPopup.btn}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t.contactPopup.subtitle}</p>
                  <div className="flex justify-between items-start gap-2">
                    <a href="https://t.me/dcqfx" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 group flex-1">
                      <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                        <Send className="w-6 h-6 -ml-0.5" />
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold text-black dark:text-white">Telegram</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">@dcqfx</div>
                      </div>
                    </a>

                    <a href="https://www.instagram.com/madebydcq" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 group flex-1">
                      <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                        <InstagramIcon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold text-black dark:text-white">Instagram</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">@madebydcq</div>
                      </div>
                    </a>

                    <a href="https://x.com/madebydcq" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 group flex-1">
                      <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                        <XIcon className="w-[22px] h-[22px]" />
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold text-black dark:text-white">X</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">@madebydcq</div>
                      </div>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="md:hidden absolute left-4 right-4 top-[72px] rounded-[24px] border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#12121A]/95 backdrop-blur-xl shadow-2xl p-4"
              >
                <nav className="flex flex-col gap-1">
                  <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5">{t.nav.about}</a>
                  <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5">{t.nav.projects}</a>
                  <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5">{t.nav.services}</a>
                </nav>

                <div className="mt-3 pt-3 border-t border-gray-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <a href="https://x.com/madebydcq" target="_blank" rel="noopener noreferrer" aria-label="X" className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><XIcon className="w-4 h-4" /></a>
                    <a href="https://www.instagram.com/madebydcq" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><InstagramIcon className="w-4 h-4" /></a>
                    <a href="https://www.youtube.com/@madebydcq" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><YoutubeIcon className="w-4 h-4" /></a>
                    <a href="https://t.me/madebydcq" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><Send className="w-4 h-4" /></a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsContactOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold shrink-0"
                  >
                    {t.nav.contact}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>


    </>
  );
};

const Hero = () => {
  const { t } = useAppContext();
  const [isHeroContactOpen, setIsHeroContactOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsHeroContactOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = isHeroContactOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isHeroContactOpen]);

  return (
    <section id="about" className="pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-12 px-4 sm:px-6">
      {/* The hero intentionally stays overflow-visible so the image slot can protrude above it. */}
      <div className="relative w-full max-w-[1100px] mx-auto min-h-0 lg:min-h-[450px] z-10">

        {/* Hero plate */}
        <div className="absolute inset-0 bg-white dark:bg-[#1A1A24]/60 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-200/60 dark:border-white/10" />

        {/* LEFT: fully centered within the left half */}
        <div className="relative z-10 w-full lg:w-1/2 min-h-0 lg:min-h-[450px] px-5 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-[430px] flex flex-col items-center">

            <div className="mb-7">
              <h1 className="text-[48px] sm:text-[56px] md:text-[64px] font-bold tracking-tighter lowercase text-black dark:text-white leading-none">
                dcq
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium mt-1">
                Dmitry
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-[2px] h-[18px] bg-black dark:bg-white shrink-0" />
              <p className="text-[13px] sm:text-[15px] font-semibold text-black dark:text-white leading-tight tracking-wide">
                {t.hero.role}
              </p>
            </div>

            <p className="text-[11px] font-bold tracking-[0.12em] text-gray-400 dark:text-gray-500 uppercase mb-7">
              {t.hero.stats}
            </p>

            <p className="text-gray-600 dark:text-gray-300 text-[14px] sm:text-[15px] leading-relaxed max-w-[390px] mb-7 sm:mb-8">
              {t.hero.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-7">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="px-7 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-sm shadow-md shadow-black/10"
              >
                {t.hero.viewProjects}
              </motion.a>

              <motion.button
                type="button"
                onClick={() => setIsHeroContactOpen(true)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="px-7 py-3.5 rounded-full bg-transparent border border-gray-300 dark:border-white/20 text-black dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              >
                {t.hero.contact}
              </motion.button>
            </div>

            <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0" />
              {t.hero.location}
            </p>

          </div>
        </div>

        {/* RIGHT: portrait image */}
        <div className="relative lg:absolute mt-2 sm:mt-4 lg:mt-0 lg:right-8 xl:right-5 lg:bottom-0 z-20 pointer-events-none flex justify-center lg:justify-start">
          <div
            className="relative w-[min(88vw,500px)] h-[390px] sm:h-[470px] lg:w-[500px] lg:h-[560px] overflow-hidden rounded-t-[96px] sm:rounded-t-[112px] lg:rounded-t-[132px] rounded-b-[18px]"
            aria-label="Portrait image"
          >
            <img
              src="/logos/dcq.png"
              alt="Dmitry"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* HERO CONTACT — full-screen */}
      <AnimatePresence>
        {isHeroContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#F7F6F3]/96 dark:bg-[#0B0B10]/96 backdrop-blur-2xl"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setIsHeroContactOpen(false);
            }}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative min-h-full w-full flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24"
            >
              <button
                type="button"
                onClick={() => setIsHeroContactOpen(false)}
                aria-label="Close contact menu"
                className="absolute top-6 right-6 sm:top-8 sm:right-8 w-11 h-11 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 flex items-center justify-center text-black dark:text-white hover:scale-105 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-w-4xl">
                <div className="text-center mb-6 sm:mb-12">
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-2 sm:mb-4">dcq</p>
                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white">{t.contactPopup.btn}</h2>
                  <p className="mt-2 sm:mt-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg">{t.contactPopup.subtitle}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                  <a href="https://t.me/dcqfx" target="_blank" rel="noopener noreferrer" className="group rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#12121A] border border-gray-200/80 dark:border-white/10 p-2.5 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[112px] sm:min-h-[230px] hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    <div className="w-11 h-11 sm:w-20 sm:h-20 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                      <Send className="w-5 h-5 sm:w-8 sm:h-8 -ml-0.5 sm:-ml-1" />
                    </div>
                    <div className="text-center mt-3 sm:mt-6">
                      <div className="text-[11px] sm:text-xl font-bold text-black dark:text-white">Telegram</div>
                      <div className="hidden sm:block text-sm text-gray-400 mt-1">@dcqfx</div>
                    </div>
                  </a>

                  <a href="https://www.instagram.com/madebydcq" target="_blank" rel="noopener noreferrer" className="group rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#12121A] border border-gray-200/80 dark:border-white/10 p-2.5 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[112px] sm:min-h-[230px] hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    <div className="w-11 h-11 sm:w-20 sm:h-20 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                      <InstagramIcon className="w-5 h-5 sm:w-8 sm:h-8" />
                    </div>
                    <div className="text-center mt-3 sm:mt-6">
                      <div className="text-[11px] sm:text-xl font-bold text-black dark:text-white">Instagram</div>
                      <div className="hidden sm:block text-sm text-gray-400 mt-1">@madebydcq</div>
                    </div>
                  </a>

                  <a href="https://x.com/madebydcq" target="_blank" rel="noopener noreferrer" className="group rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#12121A] border border-gray-200/80 dark:border-white/10 p-2.5 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[112px] sm:min-h-[230px] hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    <div className="w-11 h-11 sm:w-20 sm:h-20 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                      <XIcon className="w-5 h-5 sm:w-8 sm:h-8" />
                    </div>
                    <div className="text-center mt-3 sm:mt-6">
                      <div className="text-[11px] sm:text-xl font-bold text-black dark:text-white">X</div>
                      <div className="hidden sm:block text-sm text-gray-400 mt-1">@madebydcq</div>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Projects = () => {
  const { t, lang, theme } = useAppContext();
  const [filter, setFilter] = useState("main");
  const [activeProject, setActiveProject] = useState<any | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = activeProject ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  const filtered = useMemo(() => {
    if (filter === "main") return PROJECTS_DATA.filter(p => p.featured);
    return PROJECTS_DATA.filter(p => p.category === filter);
  }, [filter]);

  return (
    <section id="projects" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white border-b-2 border-black dark:border-white pb-2 inline-block">
          {lang === "ru" ? "Мои работы" : t.projects.title}
        </h2>

        <div className="flex flex-nowrap xl:flex-wrap gap-2 overflow-x-auto pb-2 xl:pb-0 -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const style = CATEGORY_STYLES[cat.id] ?? CATEGORY_STYLES.main;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat.id
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {cat.label[lang]}
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 items-stretch"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => {
            const category = CATEGORIES.find(c => c.id === project.category);
            const style = CATEGORY_STYLES[project.category] ?? CATEGORY_STYLES.main;
            const tag = project.tag?.[lang] ?? "";

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                key={project.id}
                onClick={() => setActiveProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveProject(project);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group cursor-pointer min-h-[390px] md:h-[430px] p-2.5 bg-white dark:bg-[#12121A] border border-gray-200 dark:border-white/10 rounded-[1.5rem] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Exact 16:9 preview — image fills the preview edge-to-edge. */}
                <div className="w-full aspect-video rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden relative shrink-0">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm font-medium">
                      [ Preview ]
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors z-20 pointer-events-none" />
                </div>

                {/* Text content — no mt-auto, so short titles don't create a gap before description */}
                <div className="px-3 pt-4 pb-3 flex flex-col min-h-0">
                  <div className="flex justify-between items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {category?.label[lang] || project.category}
                    </span>

                    {tag && (
                      <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right line-clamp-1">
                        {tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white leading-tight line-clamp-2 mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {project.desc[lang]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-md"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0B0B10] w-full max-w-4xl rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col max-h-[94vh] sm:max-h-[90vh]"
            >
              <div className="p-3 sm:p-4 flex justify-between items-center gap-3 border-b border-gray-100 dark:border-white/10 shrink-0">
                <div className="px-2 sm:px-4 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 block mb-1">
                    {CATEGORIES.find(c => c.id === activeProject.category)?.label[lang] || activeProject.category}
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-black dark:text-white leading-tight line-clamp-2">
                    {activeProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close project"
                  className="p-2 bg-gray-100 dark:bg-white/10 rounded-full shrink-0 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PROJECT PREVIEW */}
              <div className="aspect-video bg-gray-900 w-full overflow-hidden relative shrink-0">
                {activeProject.image ? (
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/30" />
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 md:gap-8 overflow-y-auto">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                    {activeProject.desc[lang]}
                  </p>

                  <div className="mt-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      {t.projects.tools}
                    </p>

                    {/* Tool chips: compact, wrapped and capped in height so many tools
                        never make the modal expand uncontrollably. */}
                    <div className="max-h-[96px] overflow-y-auto pr-1 flex flex-wrap gap-1.5 content-start overscroll-contain">
                      {activeProject.tools.map((tool: string) => (
                        <span
                          key={tool}
                          title={tool}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-white/5 text-[11px] font-medium rounded-md text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5 whitespace-nowrap"
                        >
                          <ToolLogo tool={tool} theme={theme} />
                          <span>{tool}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3 flex flex-col justify-end shrink-0">
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    {t.projects.watchVideo}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Services = () => {
  const { lang, theme } = useAppContext();

  return (
    <section id="services" className="py-12 sm:py-16 px-4 sm:px-6 max-w-[1240px] mx-auto">
      <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight text-black dark:text-white leading-none mb-12">
        {lang === "ru" ? "Что я делаю" : "What I Do"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 place-items-center">
        {SERVICES_DATA.map((srv, idx) => (
          <div
            key={idx}
            className="group flex flex-col bg-white dark:bg-[#12121A] border border-gray-200/80 dark:border-white/10 rounded-[20px] sm:rounded-[24px] overflow-hidden transition-all hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 w-full max-w-[604px] h-auto sm:h-[300px]"
          >
            {/* Top Image Area: 604 x 143px */}
            <div className="w-full h-[143px] bg-gray-100 dark:bg-white/5 relative shrink-0 overflow-hidden">
              <img
                src={theme === "dark" ? srv.image.dark : srv.image.light}
                alt={srv.title[lang]}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Text Area: 604 x 157px */}
            <div className="w-full h-auto sm:h-[157px] p-5 sm:p-8 flex flex-col justify-center shrink-0 bg-white dark:bg-[#12121A]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[20px] sm:text-[22px] font-bold text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {srv.title[lang]}
                </h3>
              </div>
              <p className="text-[15px] text-gray-500 dark:text-gray-400 max-w-[90%] leading-relaxed">
                {srv.desc[lang]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useAppContext();
  return (
    <footer className="py-12 sm:py-16 mt-10 sm:mt-12 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200/60 dark:border-white/5 max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-2xl font-bold tracking-tighter lowercase text-black dark:text-white">dcq</span>
        <span className="text-[15px] font-medium">{t.footer.role}</span>
        <span className="text-xs mt-6 uppercase tracking-widest text-gray-400 dark:text-gray-600">© 2026 DCQ. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

// ==========================================
// 5. MAIN PAGE & APP WRAPPER
// ==========================================

export default function PortfolioApp() {
  const [mounted, setMounted] = useState(false);
  // First-visit defaults: English language and dark theme.
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Restore valid saved preferences; use EN + dark if none are saved.
    const storedLang = localStorage.getItem("dcq_lang");
    const savedLang: Language = storedLang === "ru" || storedLang === "en"
      ? storedLang
      : "en";

    const storedTheme = localStorage.getItem("dcq_theme");
    const savedTheme: Theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : "dark";

    setLang(savedLang);
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    const pageBackground = savedTheme === "dark" ? "#0B0B10" : "#FFFFFF";
    document.documentElement.style.backgroundColor = pageBackground;
    document.body.style.backgroundColor = pageBackground;
    document.documentElement.style.colorScheme = savedTheme;
    setMounted(true);
  }, []);

  const toggleLang = () => {
    const next: Language = lang === "en" ? "ru" : "en";
    setLang(next);
    localStorage.setItem("dcq_lang", next);
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("dcq_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    const pageBackground = next === "dark" ? "#0B0B10" : "#FFFFFF";
    document.documentElement.style.backgroundColor = pageBackground;
    document.body.style.backgroundColor = pageBackground;
    document.documentElement.style.colorScheme = next;
  };

  // Keep the initial loading screen dark to match the default theme.
  if (!mounted) return <div className="min-h-screen bg-[#0B0B10]" />;

  const t = DICT[lang];

  return (
    <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme, t }}>
      <div className="min-h-screen overflow-x-hidden bg-white dark:bg-[#0B0B10] text-gray-900 dark:text-gray-100 font-sans selection:bg-gray-200 dark:selection:bg-gray-800 transition-colors duration-300">
        <Header />
        <main>
          <Hero />
          <Projects />
          <Services />
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}