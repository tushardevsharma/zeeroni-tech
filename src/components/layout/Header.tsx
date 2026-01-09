import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import zeeroniLogo from '@/assets/zeeroni-logo.png';
import { toast } from 'sonner';
import { useAuth } from '@/features/partner/auth/AuthContext'; // Import AuthContext
import { usePartnerNotification } from '@/features/partner/hooks/usePartnerNotification'; // Import usePartnerNotification

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, logout: authLogout } = useAuth(); // Use AuthContext
  const { showInfo } = usePartnerNotification(); // Use Partner Notification

  const isLanding = location.pathname === '/';
  const isInFlow = ['/address', '/scan', '/inventory', '/quote', '/schedule', '/tracking', '/verification', '/complete'].includes(location.pathname);
  const isPartnerRoute = location.pathname === '/partner'; // Check if on partner route

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#pricing', label: 'Pricing' },
  ];

  const handleComingSoon = () => {
    toast.info('Coming Soon', { description: "We're launching soon! Stay tuned." });
  };

  const handleLogout = () => {
    authLogout();
    showInfo('You have been logged out.');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={zeeroniLogo} alt="Zeeroni" className="h-8 md:h-10" />
            <span className="font-display font-bold text-xl text-foreground">Zeeroni</span>
          </Link>

          {/* Desktop Navigation */}
          {isLanding && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated && isPartnerRoute ? ( // Show logout button on partner route if authenticated
              <Button onClick={handleLogout} variant="secondary" className="bg-accent hover:bg-accent/80 text-white">
                Logout
              </Button>
            ) : (
              !isInFlow && ( // Original "Get Started" button for non-flow pages
                <Button onClick={handleComingSoon} className="gradient-primary font-semibold px-6">
                  Get Started
                </Button>
              )
            )}

            {/* Mobile Menu Toggle */}
            {isLanding && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isLanding && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
