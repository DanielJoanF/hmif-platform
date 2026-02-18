import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const links = [
        { name: 'BERANDA', path: '/' },
        { name: 'TENTANG', path: '/about' },
        { name: 'KEGIATAN', path: '/events' },
        { name: 'ASPIRASI', path: '/aspirations' },
        { name: 'KONTAK', path: '/contact' },
    ];

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <div className="logo">
                    <img src={logo} alt="HMIF Logo" />
                </div>
                <ul className="nav-links">
                    {links.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
