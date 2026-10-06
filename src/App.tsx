import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import PublicPortfolioPage from '@/pages/PublicPortfolioPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProfilePage from '@/pages/admin/AdminProfilePage';
import AdminEducationPage from '@/pages/admin/AdminEducationPage';
import AdminExperiencePage from '@/pages/admin/AdminExperiencePage';
import AdminAchievementsPage from '@/pages/admin/AdminAchievementsPage';
import AdminSkillsPage from '@/pages/admin/AdminSkillsPage';
import AdminArticlesPage from '@/pages/admin/AdminArticlesPage';
import AdminGalleryPage from '@/pages/admin/AdminGalleryPage';
import AdminTimelinePage from '@/pages/admin/AdminTimelinePage';
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio Website */}
          <Route path="/" element={<PublicPortfolioPage />} />

          {/* Administrator Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Administrator Dashboard & Modules */}
          <Route path="/admin" element={<AdminRouteGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="education" element={<AdminEducationPage />} />
              <Route path="experience" element={<AdminExperiencePage />} />
              <Route path="achievements" element={<AdminAchievementsPage />} />
              <Route path="skills" element={<AdminSkillsPage />} />
              <Route path="articles" element={<AdminArticlesPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="timeline" element={<AdminTimelinePage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
