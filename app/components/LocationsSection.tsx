"use client";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Image from "next/image";
import { memo, useMemo, useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

// Easily customizable locations data with coordinates
const locations = [
  {
    name: "Singapore",
    flag: "/flags/singapore.png",
    cpu: "AMD EPYC 7B13",
    lat: -20.3521,
    lng: 103.8198,
  },
  {
    name: "United States",
    flag: "/flags/usa.png",
    cpu: "Intel Xeon Gold 6152",
    lat: 30.7128,
    lng: -142.0060, // New York
  },
  {
    name: "Germany ",
    flag: "/flags/germany.png",
    cpu: "AMD EPYC 7502P",
    lat: 59.1109,
    lng: -8.6821,
  },
  {
    name: "India",
    flag: "/flags/india.png",
    cpu: "Intel Xeon 2680v4",
    lat: 20.5937,
    lng: 78.9629,
  },
  {
    name: "India",
    flag: "/flags/india.png",
    cpu: "AMD Ryzen 9 9950x",
    lat: 19.5937,
    lng: 73.9629,
  },
];

// Lazy loaded LocationItem component
const LocationItem = memo(({ location, index }: { location: typeof locations[0], index: number }) => (
  <motion.div
    className="flex items-center gap-2 sm:gap-4"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Image
      src={location.flag}
      alt={`${location.name} flag`}
      width={32}
      height={32}
      className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-full flex-shrink-0"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
    <div className="min-w-0">
      <p className="text-sm sm:text-lg text-gray-900 dark:text-white font-medium truncate">
        {location.name}
      </p>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        {location.cpu}
      </p>
    </div>
  </motion.div>
));

LocationItem.displayName = 'LocationItem';

// Convert lat/lng to SVG coordinates (adjusted for the specific world map)
const latLngToSVG = (lat: number, lng: number) => {
  // Adjusted projection to better match the world map SVG
  const svgWidth = 1000;
  const svgHeight = 500;

  // Fine-tuned projection with offsets for better alignment
  const x = ((lng + 180) / 360) * svgWidth * 0.98 + 10;
  const y = ((90 - lat) / 180) * svgHeight * 0.85 + 40;

  return { x, y };
};

// Tooltip component
const Tooltip = memo(({ location, x, y, visible }: {
  location: typeof locations[0],
  x: number,
  y: number,
  visible: boolean
}) => {
  if (!visible) return null;

  // Position tooltip directly above the dot, centered
  const tooltipX = x - 100; // Center the 200px wide tooltip (100px offset)
  const tooltipY = y - 90; // Position above the dot with some spacing

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="absolute pointer-events-none z-50"
      style={{
        left: `${(tooltipX / 1000) * 100}%`,
        top: `${(tooltipY / 500) * 100}%`,
        transform: 'translateX(-50%)', // Additional centering
      }}
    >
      <div className="backdrop-blur-sm rounded-lg  p-3 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={location.flag}
            alt={`${location.name} flag`}
            width={20}
            height={20}
            className="w-5 h-5 object-cover rounded-full"
          />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            {location.name}
          </h3>
        </div>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/90 dark:bg-white/5 border-r border-b border-gray-200/50 dark:border-white/10 rotate-45"></div>
      </div>
    </motion.div>
  );
});

Tooltip.displayName = 'Tooltip';

// World Map Component with SVG
const WorldMapSVG = memo(() => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  // Calculate positions for location dots
  const locationDots = useMemo(() => {
    return locations.map((location, index) => ({
      ...location,
      ...latLngToSVG(location.lat, location.lng),
      delay: index * 0.1
    }));
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="relative aspect-[2/1] rounded-lg overflow-hidden ">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
              <Globe className="w-8 h-8 animate-spin" />
              <span className="text-sm">Loading world map...</span>
            </div>
          </div>
        )}

        {/* World Map SVG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          <Image
            src="/World_map_with_points.svg"
            alt="World Map"
            fill
            className="object-contain filter dark:invert opacity-50 dark:hue-rotate-180 dark:brightness-0 dark:contrast-0"
            onLoad={() => setImageLoaded(true)}
            priority
          />



          {/* Location dots overlay */}
          {imageLoaded && (
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full"
            >
              {locationDots.map((location, index) => (
                <g key={location.name}>
                  {/* Pulsing circle animation */}
                  <motion.circle
                    cx={location.x}
                    cy={location.y}
                    r={hoveredDot === location.name ? "12" : "10"}
                    fill="currentColor"
                    className="icon-text-primary opacity-60"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: location.delay
                    }}
                  />

                  {/* Main dot */}
                  <motion.circle
                    cx={location.x}
                    cy={location.y}
                    r={hoveredDot === location.name ? "7" : "5"}
                    fill="currentColor"
                    className="icon-text-primary cursor-pointer"
                    style={{ pointerEvents: 'all' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{
                      duration: 0.5,
                      delay: location.delay + 0.5
                    }}
                    onMouseEnter={() => setHoveredDot(location.name)}
                    onMouseLeave={() => setHoveredDot(null)}
                  />

                </g>
              ))}
            </svg>
          )}

          {/* Tooltips */}
          {imageLoaded && locationDots.map((location) => (
            <Tooltip
              key={`tooltip-${location.name}`}
              location={location}
              x={location.x}
              y={location.y}
              visible={hoveredDot === location.name}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
});

WorldMapSVG.displayName = 'WorldMapSVG';

// Custom hook for intersection observer
const useIntersectionObserver = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Only load once
        }
      },
      { threshold }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [targetRef, isIntersecting] as const;
};

export default function LocationsSection() {
  const { t } = useLanguage();
  const [mapRef, isMapVisible] = useIntersectionObserver(0.1);

  // Memoize animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  }), []);

  const pathVariants = useMemo(() => ({
    hidden: { opacity: 0, pathLength: 0 },
    visible: { opacity: 1, pathLength: 1 }
  }), []);

  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 card-primary px-4 py-2 rounded-full mb-4">
            <Globe className="w-4 h-4 icon-primary" />
            <span className="icon-text-primary orbitron-font text-sm">{t('locations.badge')}</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 orbitron-font">
            {t('locations.title').split(' ').slice(0, -1).join(' ')} <span className="icon-text-primary relative">
              {t('locations.title').split(' ').slice(-1)[0]}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1418 125"
                className="absolute left-0 w-full text-icon-text-primary"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.5 }}
              >
                <path
                  d="M1412.29 72.17c-11.04-5.78-20.07-14.33-85.46-25.24-22.37-3.63-44.69-7.56-67.07-11.04-167.11-22.06-181.65-21.24-304.94-30.56C888.78 1.39 822.57 1.1 756.44 0c-46.63-.11-93.27 1.56-139.89 2.5C365.5 13.55 452.86 7.68 277.94 23.15 202.57 33.32 127.38 45.01 52.07 55.69c-11.23 2.41-22.63 4.17-33.71 7.22C6.1 66.33 5.64 66.19 3.89 67.79c-7.99 5.78-2.98 20.14 8.72 17.5 33.99-9.47 32.28-8.57 178.06-29.66 4.26 4.48 7.29 3.38 18.42 3.11 13.19-.32 26.38-.53 39.56-1.12 53.51-3.81 106.88-9.62 160.36-13.95 18.41-1.3 36.8-3.12 55.21-4.7 23.21-1.16 46.43-2.29 69.65-3.4 120.28-2.16 85.46-3.13 234.65-1.52 23.42.99 1.57-.18 125.72 6.9 96.61 8.88 200.92 27.94 295.42 46.12 40.87 7.91 116.67 23.2 156.31 36.78 3.81 1.05 8.28-.27 10.51-3.58 3.17-3.72 2.66-9.7-.78-13.13-3.25-3.12-8.14-3.44-12.18-5.08-17.89-5.85-44.19-12.09-63.67-16.56l26.16 3.28c23.02 3.13 46.28 3.92 69.34 6.75 10.8.96 25.43 1.81 34.34-4.39 2.26-1.54 4.86-2.75 6.21-5.27 2.76-4.59 1.13-11.06-3.59-13.68ZM925.4 23.77c37.64 1.4 153.99 10.85 196.64 14.94 45.95 5.51 91.89 11.03 137.76 17.19 24.25 4.77 74.13 11.21 101.72 18.14-11.87-1.15-23.77-1.97-35.65-3.06-133.46-15.9-266.8-33.02-400.47-47.21Z"
                  fill="currentColor"
                />
              </motion.svg>
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('locations.subtitle')}
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 mb-8 max-w-5xl mx-auto px-4"
        >
          <div className="flex flex-col items-center gap-4 sm:gap-8">
            {/* First row - 3 locations */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 lg:gap-16">
              {locations.slice(0, 3).map((location, index) => (
                <LocationItem key={location.name} location={location} index={index} />
              ))}
            </div>

            {/* Second row - 2 locations */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 lg:gap-16">
              {locations.slice(3, 5).map((location, index) => (
                <LocationItem key={location.name} location={location} index={index + 3} />
              ))}
            </div>
          </div>
        </motion.div>
        {/* World Map with SVG */}
        <div ref={mapRef}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {isMapVisible && <WorldMapSVG />}
          </motion.div>
        </div>

        {/* Locations List */}

      </div>
    </div>
  );
}
