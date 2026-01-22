import FAQSection from '../components/FAQSection';
import MemberSection from '../components/MemberSection';

const About = () => {
    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Tentang Kami</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>
                HMIF adalah organisasi kemahasiswaan yang berdedikasi untuk mendorong inovasi, membangun komunitas, dan mencapai keunggulan di lingkungan Program Studi Informatika Universitas Sanata Dharma.
            </p>

            <MemberSection />
            <FAQSection />
        </div>
    );
};

export default About;
