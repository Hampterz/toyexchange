import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import FavoritesPage from "@/pages/favorites-page";
import MessagesPage from "@/pages/messages-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Resources Pages
import CommunityGuidelines from "@/pages/resources/community-guidelines";
import SafetyTips from "@/pages/resources/safety-tips";
import FAQ from "@/pages/resources/faq";
import ContactSupport from "@/pages/resources/contact-support";
import CommunityStandards from "@/pages/resources/community-standards";

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

// Help Center Pages
import HelpCenter from "@/pages/help-center";

function Router() {
  return (
    <Switch>
      {/* Main App Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/favorites" component={FavoritesPage} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      
      {/* Resource Pages */}
      <Route path="/resources/community-guidelines" component={CommunityGuidelines} />
      <Route path="/resources/safety-tips" component={SafetyTips} />
      <Route path="/resources/faq" component={FAQ} />
      <Route path="/resources/contact-support" component={ContactSupport} />
      <Route path="/resources/community-standards" component={CommunityStandards} />
      
      {/* Legal Pages */}
      <Route path="/legal/terms-of-service" component={TermsOfService} />
      <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
      <Route path="/legal/cookie-policy" component={CookiePolicy} />
      <Route path="/legal/accessibility" component={Accessibility} />
      
      {/* Safety Center Pages */}
      <Route path="/safety-center" component={SafetyCenter} />
      <Route path="/safety-center/account-security" component={AccountSecurity} />
      <Route path="/safety-center/toy-safety" component={ToySafety} />
      <Route path="/safety-center/reporting" component={Reporting} />
      
      {/* Help Center Pages */}
      <Route path="/help-center" component={HelpCenter} />
      
      {/* Fallback for 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

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
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
