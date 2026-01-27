import { motion, useScroll, useTransform } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useRef } from 'react';

const CityBlock = ({ color, depth, label }) => {
    return (
        <div
            className={`w-64 h-64 rounded-xl flex items-center justify-center text-2xl font-bold shadow-2xl border border-white/10 backdrop-blur-sm ${color}`}
            style={{
                marginBottom: '-4rem', // Overlap effect
                zIndex: depth
            }}
        >
            {label}
        </div>
    );
};

export default function ScrollCity() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

    return (
        <section ref={containerRef} className="min-h-[200vh] relative py-20 overflow-hidden flex flex-col items-center">

            <div className="sticky top-20 z-50 text-center mb-20 pointer-events-none">
                <motion.h2 style={{ opacity }} className="text-5xl font-black text-white drop-shadow-lg">
                    THE SPIRE
                </motion.h2>
                <motion.p style={{ opacity }} className="text-neon-blue">
                    Scroll to Build
                </motion.p>
            </div>

            <div className="relative flex flex-col items-center gap-0">
                <motion.div style={{ y: y1 }} className="z-10">
                    <CityBlock color="bg-emerald-900/80" depth={10} label="The Slums" />
                </motion.div>

                <motion.div style={{ y: y2 }} className="z-20">
                    <CityBlock color="bg-blue-900/80" depth={20} label="Industrial Zone" />
                </motion.div>

                <motion.div style={{ y: y1 }} className="z-30">
                    <CityBlock color="bg-purple-900/80" depth={30} label="Residential High-Rise" />
                </motion.div>

                <motion.div style={{ y: y2 }} className="z-40">
                    <CityBlock color="bg-amber-500/80 text-black" depth={40} label="Gilded Penthouse" />
                </motion.div>
            </div>

        </section>
    );
}
