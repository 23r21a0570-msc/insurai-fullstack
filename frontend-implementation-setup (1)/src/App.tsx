import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomerLayout } from '@/components/layout/CustomerLayout';

// ── Auth pages ──────────────────────────────────────────────────
import { Login }          from '@/pages/auth/Login';
import { Register }       from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';

// ── Admin / staff pages ─────────────────────────────────────────
import { Dashboard }         from '@/pages/dashboard/Dashboard';
import { ClaimsList }        from '@/pages/claims/ClaimsList';
import { ClaimDetails }      from '@/pages/claims/ClaimDetails';
import { NewClaim }          from '@/pages/claims/NewClaim';
import { ClaimQueue }        from '@/pages/claims/ClaimQueue';
import { ClaimAnalytics }    from '@/pages/claims/ClaimAnalytics';
import { AdminClaimsHub }    from '@/pages/claims/AdminClaimsHub';
import { FraudDetection }    from '@/pages/ai/FraudDetection';
import { AdminPolicies }     from '@/pages/policies/AdminPolicies';
import { Users }             from '@/pages/admin/Users';
import { AuditLog }          from '@/pages/admin/AuditLog';
import { Roles }             from '@/pages/admin/Roles';
import { Rules }             from '@/pages/admin/Rules';
import { NotificationCenter } from '@/pages/notifications/NotificationCenter';
import { Settings }          from '@/pages/settings/Settings';
import { Profile }           from '@/pages/settings/Profile';
import { SecurityCenter }    from '@/pages/admin/SecurityCenter';
import { DataRetention }     from '@/pages/admin/DataRetention';
import { ConsentManager }    from '@/pages/admin/ConsentManager';
import { APIKeys }           from '@/pages/admin/APIKeys';
import { Integrations }     from '@/pages/admin/Integrations';
import { AIHub }            from '@/pages/admin/AIHub';
import { Blockchain }       from '@/pages/admin/Blockchain';
import { PlatformOverview } from '@/pages/admin/PlatformOverview';
import { Customer360 }       from '@/pages/admin/Customer360';
import { Segmentation }      from '@/pages/admin/Segmentation';
import { AdvancedAnalytics } from '@/pages/admin/AdvancedAnalytics';

// ── Customer pages ──────────────────────────────────────────────
import { IoTDashboard }         from '@/pages/customer/IoTDashboard';
import { CustomerDashboard }    from '@/pages/customer/Dashboard';
import { CustomerPolicies }     from '@/pages/customer/Policies';
import { CustomerClaims }       from '@/pages/customer/Claims';
import { CustomerPayments }     from '@/pages/customer/Payments';
import { CustomerProfile }      from '@/pages/customer/Profile';
import { Quote }                from '@/pages/customer/Quote';
import { Rewards }              from '@/pages/customer/Rewards';
import { Referral }             from '@/pages/customer/Referral';
import { CoverageCalculator }   from '@/pages/customer/CoverageCalculator';
import { Renewal }              from '@/pages/customer/Renewal';
import { PolicyManagement }    from '@/pages/customer/PolicyManagement';
import { CustomerSupport }     from '@/pages/customer/Support';
import { Learn }               from '@/pages/customer/Learn';
import { Social }              from '@/pages/customer/Social';

// ── Admin detail pages ──────────────────────────────────────────
import { CustomerDetail }    from '@/pages/admin/CustomerDetail';
import { PolicyDetail }      from '@/pages/admin/PolicyDetail';

// ── Search ──────────────────────────────────────────────────────
import { SearchResults }     from '@/pages/search/SearchResults';
import { LandingPage } from '@/pages/landing/LandingPage';

// ── Error pages ─────────────────────────────────────────────────
import { NotFound }     from '@/pages/errors/NotFound';
import { ServerError }  from '@/pages/errors/ServerError';
import { ErrorBoundary } from '@/pages/errors/ErrorBoundary';

// ─────────────────────────────────────────────────────────────────
// Loading spinner (shown while auth state rehydrates)
// ─────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1A]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">Loading…</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Admin / Staff protected routes (role: admin | manager | analyst | agent)
// ─────────────────────────────────────────────────────────────────
function AdminRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // If customer lands here, redirect to their dashboard
  if (user?.role === 'customer') return <Navigate to="/customer/dashboard" replace />;

  return (
    <MainLayout>
      <Routes>
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="claims"          element={<ClaimsList />} />
        <Route path="claims/new"      element={<NewClaim />} />
        <Route path="claims/:id"      element={<ClaimDetails />} />
        <Route path="queue"           element={<ClaimQueue />} />
        <Route path="claims/analytics" element={<ClaimAnalytics />} />
        <Route path="claims/hub"      element={<AdminClaimsHub />} />
        <Route path="fraud"           element={<FraudDetection />} />
        <Route path="policies"        element={<AdminPolicies />} />
        <Route path="users"           element={<Users />} />
        <Route path="audit"           element={<AuditLog />} />
        <Route path="admin/roles"     element={<Roles />} />
        <Route path="admin/rules"     element={<Rules />} />
        <Route path="notifications"   element={<NotificationCenter />} />
        <Route path="settings"        element={<Settings />} />
        <Route path="profile"         element={<Profile />} />
        <Route path="security"          element={<SecurityCenter />} />
        <Route path="data-retention"  element={<DataRetention />} />
        <Route path="consent"         element={<ConsentManager />} />
        <Route path="api-keys"        element={<APIKeys />} />
        <Route path="integrations"    element={<Integrations />} />
        <Route path="ai-hub"          element={<AIHub />} />
        <Route path="blockchain"      element={<Blockchain />} />
        <Route path="customers/360/:id" element={<Customer360 />} />
        <Route path="customers/segments" element={<Segmentation />} />
        <Route path="analytics/advanced" element={<AdvancedAnalytics />} />
        <Route path="customers/:id"   element={<CustomerDetail />} />
        <Route path="policies/:id"    element={<PolicyDetail />} />
        <Route path="search"            element={<SearchResults />} />
        <Route path="platform-overview" element={<PlatformOverview />} />
        <Route path="500"             element={<ServerError />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

// ─────────────────────────────────────────────────────────────────
// Customer protected routes (role: customer)
// ─────────────────────────────────────────────────────────────────
function CustomerRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // If admin lands here, redirect to admin dashboard
  if (user?.role !== 'customer') return <Navigate to="/dashboard" replace />;

  return (
    <CustomerLayout>
      <Routes>
        <Route path="dashboard"  element={<CustomerDashboard />} />
        <Route path="policies"   element={<CustomerPolicies />} />
        <Route path="claims"     element={<CustomerClaims />} />
        <Route path="payments"   element={<CustomerPayments />} />
        <Route path="profile"    element={<CustomerProfile />} />
        <Route path="quote"      element={<Quote />} />
        <Route path="rewards"    element={<Rewards />} />
        <Route path="referral"   element={<Referral />} />
        <Route path="calculator" element={<CoverageCalculator />} />
        <Route path="renewal"           element={<Renewal />} />
        <Route path="policy-management" element={<PolicyManagement />} />
        <Route path="support"           element={<CustomerSupport />} />
        <Route path="learn"             element={<Learn />} />
        <Route path="social"            element={<Social />} />
        <Route path="iot"               element={<IoTDashboard />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </CustomerLayout>
  );
}

// ─────────────────────────────────────────────────────────────────
// Root redirect — send user to correct dashboard based on role
// ─────────────────────────────────────────────────────────────────
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <LandingPage />;
  if (user?.role === 'customer') return <Navigate to="/customer/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

// ─────────────────────────────────────────────────────────────────
// Public-only route guard (redirect to dashboard if already logged in)
// ─────────────────────────────────────────────────────────────────
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) {
    if (user?.role === 'customer') return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────────
// App Routes
// ─────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public */}
      <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Admin / staff */}
      <Route path="/*"               element={<AdminRoutes />} />

      {/* Customer portal */}
      <Route path="/customer/*"      element={<CustomerRoutes />} />
    </Routes>
  );
}

// ─────────────────────────────────────────────────────────────────
// App root
// ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
