import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import styles from './Events.module.css';

const Events = () => {
    const [documentation, setDocumentation] = useState([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadData, setUploadData] = useState({
        title: '',
        caption: '',
        image: null
    });
    const [isUploading, setIsUploading] = useState(false);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadData(prev => ({ ...prev, image: file }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!uploadData.title.trim() || !uploadData.image) {
            alert('Judul dan foto harus diisi!');
            return;
        }

        const formData = new FormData();
        formData.append('title', uploadData.title.trim());
        formData.append('caption', uploadData.caption.trim());
        formData.append('image', uploadData.image);

        setIsUploading(true);
        try {
            const newDoc = await apiService.postFormData('/documentation', formData);
            setDocumentation(prev => [newDoc, ...prev]);
            setUploadData({ title: '', caption: '', image: null });
            setShowUploadForm(false);
            alert('Dokumentasi berhasil diupload! 📸');
        } catch (error) {
            console.error('Failed to upload documentation:', error);
            alert('Gagal mengupload. Pastikan server backend berjalan.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Kegiatan & Galeri</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>
                    Dokumentasi kegiatan dan momen berharga HMIF
                </p>
                <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    style={{
                        marginTop: '20px',
                        padding: '12px 24px',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600'
                    }}
                >
                    {showUploadForm ? '❌ Tutup Form' : '📤 Upload Dokumentasi'}
                </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
                <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Upload Dokumentasi</h2>
                    <form onSubmit={handleUpload}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Judul *</label>
                            <input
                                type="text"
                                value={uploadData.title}
                                onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Contoh: Workshop AI 2024"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Caption</label>
                            <textarea
                                value={uploadData.caption}
                                onChange={(e) => setUploadData(prev => ({ ...prev, caption: e.target.value }))}
                                placeholder="Deskripsi singkat tentang foto ini..."
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Foto *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUploading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'var(--accent-primary)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: isUploading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                opacity: isUploading ? 0.6 : 1
                            }}
                        >
                            {isUploading ? 'Mengupload...' : 'Upload'}
                        </button>
                    </form>
                </div>
            )}

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

            {documentation.length === 0 && !showUploadForm && (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                        Belum ada dokumentasi. Upload yang pertama! 📸
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
