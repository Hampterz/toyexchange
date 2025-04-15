import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";

type AvatarWithFallbackProps = {
  user: Omit<User, "password"> | null;
  className?: string;
};

export function AvatarWithFallback({ user, className }: AvatarWithFallbackProps) {
  const fallbackText = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
    
  return (
    <Avatar className={className}>
      <AvatarImage src={user?.profilePicture || ""} alt={user?.name || "User"} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}
