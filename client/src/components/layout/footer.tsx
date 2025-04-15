import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <i className="fas fa-gamepad text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold font-heading">ToyShare</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Connecting families to share joy and reduce waste, one toy at a time.
            </p>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">Community Guidelines</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">Safety Tips</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">FAQ</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">Cookie Policy</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white text-sm">Accessibility</Link></li>
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

        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} ToyShare. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-neutral-400 hover:text-white text-sm">Help Center</Link>
            <Link href="#" className="text-neutral-400 hover:text-white text-sm">Safety Center</Link>
            <Link href="#" className="text-neutral-400 hover:text-white text-sm">Community Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
