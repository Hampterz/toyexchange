import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, Home, Search, Heart, User, Menu, X, HelpCircle, Shield, FileText, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileNavProps = {
  onAddToyClick: () => void;
};

export function MobileNav({ onAddToyClick }: MobileNavProps) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-lg z-40">
        <div className="flex items-center justify-around">
          <Link href="/" className={`flex flex-col items-center py-3 px-2 ${location === '/' ? 'text-blue-700' : 'text-blue-400'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/favorites" className={`flex flex-col items-center py-3 px-2 ${location === '/favorites' ? 'text-blue-700' : 'text-blue-400'}`}>
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Favorites</span>
          </Link>
          <button 
            onClick={onAddToyClick}
            className="flex flex-col items-center py-3 px-2 text-blue-400"
          >
            <div className="h-12 w-12 rounded-full bg-blue-700 -mt-5 flex items-center justify-center text-white shadow-md">
              <Plus className="h-5 w-5" />
            </div>
          </button>
          <Link href="/profile" className={`flex flex-col items-center py-3 px-2 ${location === '/profile' ? 'text-blue-700' : 'text-blue-400'}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center py-3 px-2 text-blue-400">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader className="text-left">
                <SheetTitle>Resources</SheetTitle>
                <SheetDescription>
                  Help, safety, and community resources
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/help-center" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-700" />
                    <span>Help Center</span>
                  </Link>
                  <Link href="/safety-center" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                    <Shield className="w-5 h-5 mr-2 text-blue-700" />
                    <span>Safety Center</span>
                  </Link>
                  <Link href="/resources/community-standards" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-700" />
                    <span>Community Standards</span>
                  </Link>
                  <Link href="/resources/safety-tips" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                    <Shield className="w-5 h-5 mr-2 text-blue-700" />
                    <span>Safety Tips</span>
                  </Link>
                  <Link href="/resources/faq" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-700" />
                    <span>FAQ</span>
                  </Link>
                  <Link href="/resources/contact-support" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-700" />
                    <span>Contact Support</span>
                  </Link>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Legal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/legal/terms-of-service" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                      <FileText className="w-5 h-5 mr-2 text-blue-700" />
                      <span>Terms of Service</span>
                    </Link>
                    <Link href="/legal/privacy-policy" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                      <FileText className="w-5 h-5 mr-2 text-blue-700" />
                      <span>Privacy Policy</span>
                    </Link>
                    <Link href="/legal/cookie-policy" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                      <FileText className="w-5 h-5 mr-2 text-blue-700" />
                      <span>Cookie Policy</span>
                    </Link>
                    <Link href="/legal/accessibility" className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50">
                      <FileText className="w-5 h-5 mr-2 text-blue-700" />
                      <span>Accessibility</span>
                    </Link>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <button className="w-full py-2 px-4 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors">
                    Close
                  </button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
