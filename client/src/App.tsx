import { Switch, Route } from "wouter";
import React, { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import UserProfilePage from "@/pages/user-profile-page";
import FavoritesPage from "@/pages/favorites-page";
import MessagesPage from "@/pages/messages-page";
import ToyPage from "@/pages/toy-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CookieConsent } from "@/components/ui/cookie-consent";

// Resources Pages
import CommunityGuidelines from "@/pages/resources/community-guidelines";
import SafetyTips from "@/pages/resources/safety-tips";
import FAQ from "@/pages/resources/faq";
import ContactSupport from "@/pages/resources/contact-support";
import CommunityStandards from "@/pages/resources/community-standards";
import ExchangeGuide from "@/pages/resources/exchange-guide";

// Legal Pages
import TermsOfService from "@/pages/legal/terms-of-service";
import PrivacyPolicy from "@/pages/legal/privacy-policy";
import CookiePolicy from "@/pages/legal/cookie-policy";
import Accessibility from "@/pages/legal/accessibility";

// Safety Center Pages
import SafetyCenter from "@/pages/safety-center";
import AccountSecurity from "@/pages/safety-center/account-security";
import ToySafety from "@/pages/safety-center/toy-safety";
import Reporting from "@/pages/safety-center/reporting";

// Community Features Pages
import GroupsPage from "@/pages/community/groups-page";
import GroupDetailsPage from "@/pages/community/group-details-page";
import MeetupLocationsPage from "@/pages/community/meetup-locations-page";
import ToyMapView from "@/pages/community/toy-map-view";
import LeaderboardPage from "@/pages/community/leaderboard-page";

// Help Center Pages
import HelpCenter from "@/pages/help-center";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import ReportsManagement from "@/pages/admin/reports-management";
import ContactMessages from "@/pages/admin/contact-messages";
import SafetyTipsManagement from "@/pages/admin/safety-tips-management";
import MeetupLocationVerification from "@/pages/admin/meetup-location-verification";

// Layout component that wraps all pages with consistent header/footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };
  
  const handleAddToyClick = () => {
    // In a production app, we would show the add toy modal here
    console.log("Add toy clicked");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearchChange={handleSearchChange} searchValue={searchQuery} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileNav onAddToyClick={handleAddToyClick} />
    </div>
  );
};

const Router = () => {
  return (
    <Switch>
      {/* Main App Routes */}
      <Route path="/">
        {() => <Layout><HomePage /></Layout>}
      </Route>
      <Route path="/auth">
        {() => <Layout><AuthPage /></Layout>}
      </Route>
      <Route path="/profile">
        {() => (
          <Layout>
            <ProtectedRoute path="/profile" component={ProfilePage} />
          </Layout>
        )}
      </Route>
      <Route path="/favorites">
        {() => (
          <Layout>
            <ProtectedRoute path="/favorites" component={FavoritesPage} />
          </Layout>
        )}
      </Route>
      <Route path="/messages">
        {() => (
          <Layout>
            <ProtectedRoute path="/messages" component={MessagesPage} />
          </Layout>
        )}
      </Route>

      {/* Public user profile page - accessible to all users */}
      <Route path="/users/:userId">
        {() => <Layout><UserProfilePage /></Layout>}
      </Route>
      
      {/* Public individual toy page - accessible to all users */}
      <Route path="/toys/:id">
        {() => <Layout><ToyPage /></Layout>}
      </Route>
      
      {/* Resource Pages */}
      <Route path="/resources/community-guidelines">
        {() => <Layout><CommunityGuidelines /></Layout>}
      </Route>
      <Route path="/resources/safety-tips">
        {() => <Layout><SafetyTips /></Layout>}
      </Route>
      <Route path="/resources/faq">
        {() => <Layout><FAQ /></Layout>}
      </Route>
      <Route path="/resources/contact-support">
        {() => <Layout><ContactSupport /></Layout>}
      </Route>
      <Route path="/resources/community-standards">
        {() => <Layout><CommunityStandards /></Layout>}
      </Route>
      <Route path="/resources/exchange-guide">
        {() => <Layout><ExchangeGuide /></Layout>}
      </Route>
      
      {/* Legal Pages */}
      <Route path="/legal/terms-of-service">
        {() => <Layout><TermsOfService /></Layout>}
      </Route>
      <Route path="/legal/privacy-policy">
        {() => <Layout><PrivacyPolicy /></Layout>}
      </Route>
      <Route path="/legal/cookie-policy">
        {() => <Layout><CookiePolicy /></Layout>}
      </Route>
      <Route path="/legal/accessibility">
        {() => <Layout><Accessibility /></Layout>}
      </Route>
      
      {/* Safety Center Pages */}
      <Route path="/safety-center">
        {() => <Layout><SafetyCenter /></Layout>}
      </Route>
      <Route path="/safety-center/account-security">
        {() => <Layout><AccountSecurity /></Layout>}
      </Route>
      <Route path="/safety-center/toy-safety">
        {() => <Layout><ToySafety /></Layout>}
      </Route>
      <Route path="/safety-center/reporting">
        {() => <Layout><Reporting /></Layout>}
      </Route>
      
      {/* Help Center Pages */}
      <Route path="/help-center">
        {() => <Layout><HelpCenter /></Layout>}
      </Route>
      
      {/* Community Features */}
      <Route path="/community/groups">
        {() => <Layout><GroupsPage /></Layout>}
      </Route>
      <Route path="/community/groups/:groupId">
        {() => <Layout><GroupDetailsPage /></Layout>}
      </Route>
      <Route path="/community/meetup-locations">
        {() => <Layout><MeetupLocationsPage /></Layout>}
      </Route>
      <Route path="/community/toy-map">
        {() => <Layout><ToyMapView /></Layout>}
      </Route>
      <Route path="/community/leaderboard">
        {() => <Layout><LeaderboardPage /></Layout>}
      </Route>

      {/* Admin Pages */}
      <Route path="/admin/dashboard">
        {() => (
          <Layout>
            <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
          </Layout>
        )}
      </Route>
      <Route path="/admin/reports-management">
        {() => (
          <Layout>
            <ProtectedRoute path="/admin/reports-management" component={ReportsManagement} />
          </Layout>
        )}
      </Route>
      <Route path="/admin/contact-messages">
        {() => (
          <Layout>
            <ProtectedRoute path="/admin/contact-messages" component={ContactMessages} />
          </Layout>
        )}
      </Route>
      <Route path="/admin/safety-tips">
        {() => (
          <Layout>
            <ProtectedRoute path="/admin/safety-tips" component={SafetyTipsManagement} />
          </Layout>
        )}
      </Route>
      <Route path="/admin/meetup-locations">
        {() => (
          <Layout>
            <ProtectedRoute path="/admin/meetup-locations" component={MeetupLocationVerification} />
          </Layout>
        )}
      </Route>
      
      {/* Fallback for 404 */}
      <Route>
        {() => <Layout><NotFound /></Layout>}
      </Route>
    </Switch>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <Router />
          <Toaster />
          <CookieConsent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
