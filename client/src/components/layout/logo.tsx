import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/">
      <div className={cn("flex items-center cursor-pointer", className)}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <rect width="40" height="40" rx="8" fill="#1E40AF" />
          <circle cx="15" cy="15" r="5" fill="#FBBF24" />
          <circle cx="25" cy="25" r="5" fill="#EC4899" />
          <circle cx="15" cy="25" r="5" fill="#10B981" />
          <circle cx="25" cy="15" r="5" fill="#60A5FA" />
        </svg>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
          ToyShare
        </span>
      </div>
    </Link>
  );
}