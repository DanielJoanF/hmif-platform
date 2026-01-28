import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import styles from './Events.module.css';

const Events = () => {
    const [documentation, setDocumentation] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchDocumentation();
    }, []);

    const fetchDocumentation = async () => {
        try {
            const data = await apiService.get('/documentation');
            setDocumentation(data);
        } catch (error) {
            console.error('Failed to fetch documentation:', error);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Kegiatan & Galeri</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>
                    Dokumentasi kegiatan dan momen berharga HMIF
                </p>
            </div>

            {/* Gallery Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
                marginTop: '40px'
            }}>
                {documentation.map((doc) => (
                    <div
                        key={doc._id}
                        className="glass-panel"
                        style={{
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease'
                        }}
                        onClick={() => setSelectedImage(doc)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <img
                            src={`http://localhost:5000${doc.imageUrl}`}
                            alt={doc.title}
                            style={{
                                width: '100%',
                                height: '250px',
                                objectFit: 'cover',
                                borderRadius: '8px 8px 0 0'
                            }}
                        />
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>{doc.title}</h3>
                            {doc.caption && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {doc.caption}
                                </p>
                            )}
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
                                {new Date(doc.uploadedAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {documentation.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                        Belum ada dokumentasi kegiatan 📸
                    </p>
                </div>
            )}

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <div style={{ maxWidth: '90%', maxHeight: '90%', textAlign: 'center' }}>
                        <img
                            src={`http://localhost:5000${selectedImage.imageUrl}`}
                            alt={selectedImage.title}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                borderRadius: '12px'
                            }}
                        />
                        <h2 style={{ marginTop: '20px', color: 'white' }}>{selectedImage.title}</h2>
                        {selectedImage.caption && (
                            <p style={{ marginTop: '10px', color: 'rgba(255,255,255,0.8)' }}>
                                {selectedImage.caption}
                            </p>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                            style={{
                                marginTop: '20px',
                                padding: '10px 24px',
                                background: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;

