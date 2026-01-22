import { useState } from 'react';
import styles from './AspirationWall.module.css';

const AspirationWall = () => {
    const [aspirations, setAspirations] = useState([
        { id: 1, tag: 'Akademik', text: 'Butuh lebih banyak workshop tentang AI dan Data Science!', date: '2 hari lalu' },
        { id: 2, tag: 'Fasilitas', text: 'WiFi di ruang mahasiswa perlu ditingkatkan.', date: '5 hari lalu' },
        { id: 3, tag: 'Kegiatan', text: 'Bisa adakan hackathon semester depan?', date: '1 minggu lalu' },
        { id: 4, tag: 'Umum', text: 'Suka banget desain merchandise barunya!', date: '1 minggu lalu' },
    ]);

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
                    ></textarea>
                    <div className={styles.formFooter}>
                        <select className={styles.select}>
                            <option>Umum</option>
                            <option>Akademik</option>
                            <option>Fasilitas</option>
                            <option>Kegiatan</option>
                        </select>
                        <button className={styles.submitBtn}>Kirim Aspirasi</button>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className={styles.grid}>
                {aspirations.map((item) => (
                    <div key={item.id} className={`${styles.card} glass-panel`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.tag}>{item.tag}</span>
                            <span className={styles.date}>{item.date}</span>
                        </div>
                        <p className={styles.cardText}>"{item.text}"</p>
                    </div>
                ))}
                {/* Decorative placeholders to make it look full */}
                <div className={`${styles.card} glass-panel`} style={{ opacity: 0.5 }}>
                    <p className={styles.cardText} style={{ fontStyle: 'italic' }}>...</p>
                </div>
            </div>
        </div>
    );
};

export default AspirationWall;
