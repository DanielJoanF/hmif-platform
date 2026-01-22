import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import styles from './Hero.module.css';

const Hero = () => {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const shapesRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text Animation
            gsap.from(textRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
            });

            // Background Shapes Animation
            gsap.to('.hero-shape', {
                y: 'random(-20, 20)',
                x: 'random(-20, 20)',
                rotation: 'random(-10, 10)',
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 1,
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className={styles.hero} ref={heroRef}>
            {/* Abstract Background Shapes */}
            <div className={styles.shapes} ref={shapesRef}>
                <div className={`${styles.shape} ${styles.shape1} hero-shape`}></div>
                <div className={`${styles.shape} ${styles.shape2} hero-shape`}></div>
                <div className={`${styles.shape} ${styles.shape3} hero-shape`}></div>
            </div>

            <div className={`container ${styles.content}`} ref={textRef}>
                <h2 className={styles.subtitle}>Himpunan Mahasiswa Informatika</h2>
                <h1 className={styles.title}>
                    Masa Depan <span className="gradient-text">Informatika</span>
                </h1>
                <p className={styles.description}>
                    Pusat informasi terpadu bagi mahasiswa untuk terhubung, berinovasi, dan membentuk masa depan.
                    Akses sumber daya, kegiatan, dan sampaikan aspirasimu dalam satu platform modern.
                </p>

                <div className={styles.actions}>
                    <Link to="/about" className={styles.btnPrimary}>
                        Kenali HMIF
                    </Link>
                    <Link to="/aspirations" className={styles.btnSecondary}>
                        Sampaikan Aspirasi
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
