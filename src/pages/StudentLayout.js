// src/pages/StudentLayout.js
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import LogoText from '../components/LogoText';

const StudentLayout = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard/student');
  };

  return (
    <div className="dashboard-container dark-theme">
      <aside className="sidebar">
        <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <LogoText variant="sidebar" />
        </div>
        <nav>
          <ul>
            <li><Link to="/dashboard/student"><span className="nav-icon">📊</span>Dashboard</Link></li>
            <li><Link to="/dashboard/student/profile"><span className="nav-icon">👤</span>Profile</Link></li>
            <li><Link to="/dashboard/student/modules"><span className="nav-icon">📚</span>My Modules</Link></li>
            <li><Link to="/dashboard/student/grades"><span className="nav-icon">📈</span>Grades</Link></li>
            <li><Link to="/dashboard/student/assessments"><span className="nav-icon">📝</span>Assessments</Link></li>
            <li><Link to="/dashboard/student/quizzes"><span className="nav-icon">❓</span>Quizzes</Link></li>
            <li><Link to="/dashboard/student/announcements"><span className="nav-icon">📢</span>Announcements</Link></li>
            <li><Link to="/dashboard/student/ewallet" className="achievement-link"><span className="nav-icon">🏆</span>Achievements</Link></li>
            <li><Link to="/logout" className="signout-link"><span className="nav-icon">🚪</span>Sign Out</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
