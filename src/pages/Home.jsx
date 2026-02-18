import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../assets/logo.png';

const Home = () => {
    return (
        <div className="home-page">
            <div className="hero-container container">

                {/* Background Logo Layer (Faded) */}
                <div className="hero-logo-bg">
                    <img src={logo} alt="HMIF Logo Background" />
                </div>

                {/* Main Text Layer (Foreground) */}
                <div className="hero-text text-display">
                    <div className="line">HMIF</div>
                    <div className="line">USD</div>
                </div>

                {/* Floating Orb */}
                <div className="floating-orb"></div>

                {/* Left Content - RESTORED CONTENT - NO ARROWS */}
                <div className="hero-info">
                    <h3>Himpunan Mahasiswa Informatika</h3>
                    <p>
                        Pusat informasi terpadu bagi mahasiswa untuk terhubung, berinovasi, dan membentuk masa depan.
                        Akses sumber daya, kegiatan, dan sampaikan aspirasimu.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/aspirations" className="arrow-link">
                            Sampaikan Aspirasi
                        </Link>
                    </div>
                </div>

                {/* Right Side Card - NO ARROWS */}
                <div className="side-card">
                    <div className="card-header">
                        <span>Kegiatan Terbaru</span>
                    </div>
                    <div className="card-image">
                        {/* Placeholder for event image */}
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #111, #333)' }}></div>
                        <div className="play-icon">▶</div>
                    </div>
                </div>

                {/* Action Button - RESTORED CONTENT - NO ARROW */}
                <div className="action-button-container">
                    <Link to="/about">
                        <button className="start-btn text-display">
                            Kenali HMIF
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Home;
