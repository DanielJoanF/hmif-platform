import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const links = [
        { name: 'Beranda', path: '/' },
        { name: 'Tentang', path: '/about' },
        { name: 'Kegiatan', path: '/events' },
        { name: 'Aspirasi', path: '/aspirations' },
        { name: 'Kontak', path: '/contact' },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <div className={styles.logo}>
                    <img src={logo} alt="HMIF Logo" className={styles.logoImage} />
                </div>

                <ul className={styles.navLinks}>
                    {links.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className={styles.mobileToggle}>
                    {/* Mobile Menu Icon Placeholder */}
                    <span>☰</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
