import AspirationWall from '../components/AspirationWall';

const Aspirations = () => {
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Aspirasi Mahasiswa</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>
                    Suaramu penting! Sampaikan ide, kritik, dan saranmu untuk HMIF yang lebih baik.
                </p>
            </div>
            <AspirationWall />
        </div>
    );
};

export default Aspirations;
