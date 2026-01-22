const Contact = () => {
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Hubungi Kami</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '800px' }}>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '12px' }}>📧 Email</h3>
                    <p style={{ color: 'var(--text-muted)' }}>hmif@usd.ac.id</p>
                </div>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '12px' }}>📍 Lokasi</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Kampus III USD, Paingan, Yogyakarta</p>
                </div>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '12px' }}>📱 Instagram</h3>
                    <p style={{ color: 'var(--text-muted)' }}>@hmif_usd</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
