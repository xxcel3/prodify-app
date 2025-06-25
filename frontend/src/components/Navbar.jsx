import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNav = (path) => {
        navigate(path);
        setMenuOpen(false); // close menu after click (on mobile)
    };

    return (
        <div className="navbar-container">
            {/* Mobile Menu Icon */}
            <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <FaBars size={24} />
            </div>

            {/* Sidebar or dropdown */}
            <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
                <button onClick={() => handleNav("/")}>Home</button>
                <button onClick={() => handleNav("/note-history")}>Note History</button>
                <button onClick={() => handleNav("/todo")}>To-Do List</button>
                <button onClick={() => handleNav("/calendar")}>Calendar</button>
                <button onClick={() => handleNav("/settings")}>Settings</button>
            </nav>
        </div>
    );
}

export default Navbar;
