import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import styles from './AspirationWall.module.css';

const AspirationWall = () => {
    const [aspirations, setAspirations] = useState([]);
    const [newAspiration, setNewAspiration] = useState('');
    const [selectedTag, setSelectedTag] = useState('Umum');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchAspirations();
    }, []);

    const fetchAspirations = async () => {
        try {
            const data = await apiService.get('/aspirations');
            setAspirations(data);
        } catch (error) {
            console.error('Failed to fetch aspirations:', error);
        }
    };

    const handleSubmit = async () => {
        if (!newAspiration.trim()) {
            alert('Tolong tulis aspirasimu!');
            return;
        }

        setIsSubmitting(true);
        try {
            const savedAspiration = await apiService.post('/aspirations', {
                tag: selectedTag,
                text: newAspiration.trim()
            });
            setAspirations(prev => [savedAspiration, ...prev]);
            setNewAspiration('');
            setSelectedTag('Umum');
            alert('Aspirasi berhasil dikirim! 🎉');
        } catch (error) {
            console.error('Failed to submit aspiration:', error);
            alert('Gagal mengirim aspirasi. Pastikan server backend berjalan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari lalu`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
        return `${Math.floor(diffDays / 30)} bulan lalu`;
    };

    return (
        <div className={styles.wallContainer}>
            {/* Submission Section */}
            <div className={styles.inputSection}>
                <h2 className="gradient-text">Sampaikan Suaramu</h2>
                <p className={styles.subtitle}>Masukan kamu membentuk masa depan kita. Bisa anonim atau dengan nama.</p>

                <div className={`glass-panel ${styles.formCard}`}>
                    <textarea
                        placeholder="Apa yang ada di pikiranmu?"
                        className={styles.textarea}
                        rows="3"
                        value={newAspiration}
                        onChange={(e) => setNewAspiration(e.target.value)}
                    ></textarea>
                    <div className={styles.formFooter}>
                        <select
                            className={styles.select}
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            <option>Umum</option>
                            <option>Akademik</option>
                            <option>Fasilitas</option>
                            <option>Kegiatan</option>
                        </select>
                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Mengirim...' : 'Kirim Aspirasi'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className={styles.grid}>
                {aspirations.map((item) => (
                    <div key={item._id} className={`${styles.card} glass-panel`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.tag}>{item.tag}</span>
                            <span className={styles.date}>{formatDate(item.createdAt)}</span>
                        </div>
                        <p className={styles.cardText}>"{item.text}"</p>
                    </div>
                ))}
                {aspirations.length === 0 && (
                    <div className={`${styles.card} glass-panel`} style={{ opacity: 0.5 }}>
                        <p className={styles.cardText} style={{ fontStyle: 'italic' }}>
                            Belum ada aspirasi. Jadilah yang pertama! 🚀
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AspirationWall;
