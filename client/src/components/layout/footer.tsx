import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Globe, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
              <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center shadow-md">
                <i className="fas fa-gamepad text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold font-heading">ToyShare</span>
            </Link>
            <p className="text-neutral-400 text-sm">
              Connecting families to share joy and reduce waste, one toy at a time.
            </p>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/resources/community-standards" className="text-neutral-400 hover:text-white text-sm">Community Guidelines</Link></li>
              <li><Link href="/resources/safety-tips" className="text-neutral-400 hover:text-white text-sm">Safety Tips</Link></li>
              <li><Link href="/resources/faq" className="text-neutral-400 hover:text-white text-sm">FAQ</Link></li>
              <li><Link href="/resources/contact-support" className="text-neutral-400 hover:text-white text-sm">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/legal/terms-of-service" className="text-neutral-400 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link href="/legal/privacy-policy" className="text-neutral-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link href="/legal/cookie-policy" className="text-neutral-400 hover:text-white text-sm">Cookie Policy</Link></li>
              <li><Link href="/legal/accessibility" className="text-neutral-400 hover:text-white text-sm">Accessibility</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition">
                <i className="fab fa-pinterest"></i>
              </Link>
            </div>
            <p className="text-neutral-400 text-sm">
              Subscribe to our newsletter for community updates
            </p>
            <div className="mt-2 flex">
              <Input type="email" placeholder="Your email" className="rounded-r-none bg-neutral-700 border-0 focus:ring-2 focus:ring-primary text-sm w-full" />
              <Button className="rounded-l-none bg-primary hover:bg-primary/90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Trust badges section */}
        <div className="border-t border-neutral-700 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-700 p-4 rounded-lg flex flex-col items-center text-center">
              <Shield className="h-8 w-8 text-blue-400 mb-2" />
              <h5 className="font-medium text-sm mb-1">Trusted Platform</h5>
              <p className="text-neutral-400 text-xs">Verified user accounts &amp; secure communication</p>
            </div>
            
            <div className="bg-neutral-700 p-4 rounded-lg flex flex-col items-center text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
              <h5 className="font-medium text-sm mb-1">Safety Verified</h5>
              <p className="text-neutral-400 text-xs">All toy listings reviewed for safety standards</p>
            </div>
            
            <div className="bg-neutral-700 p-4 rounded-lg flex flex-col items-center text-center">
              <Globe className="h-8 w-8 text-blue-400 mb-2" />
              <h5 className="font-medium text-sm mb-1">Community Driven</h5>
              <p className="text-neutral-400 text-xs">Built by parents, for families worldwide</p>
            </div>
            
            <div className="bg-neutral-700 p-4 rounded-lg flex flex-col items-center text-center">
              <Award className="h-8 w-8 text-yellow-400 mb-2" />
              <h5 className="font-medium text-sm mb-1">Eco-Friendly</h5>
              <p className="text-neutral-400 text-xs">Promoting sustainability through reuse</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} ToyShare. All rights reserved.</p>
              <div className="h-4 w-px bg-neutral-700"></div>
              <p className="text-neutral-500 text-xs">Made with ❤️ for families</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/help-center" className="text-neutral-400 hover:text-white text-sm">Help Center</Link>
              <Link href="/safety-center" className="text-neutral-400 hover:text-white text-sm">Safety Center</Link>
              <Link href="/community/toy-map" className="text-neutral-400 hover:text-white text-sm">Toy Map</Link>
              <Link href="/resources/community-standards" className="text-neutral-400 hover:text-white text-sm">Community Standards</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
