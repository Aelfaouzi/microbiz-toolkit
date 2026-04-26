import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();

  const tabs = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Sales', path: '/sales', icon: '💰' },
    { label: 'Expenses', path: '/expenses', icon: '💸' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`bottom-nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
