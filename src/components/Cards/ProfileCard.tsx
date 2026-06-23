import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCard = () => {
  return (
    <Card className="w-full max-w-sm shadow-lg">
      {/* Profile Header */}
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="Jakob Botosh" />
          <AvatarFallback>JB</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold leading-none">Jakob Botosh</h2>
          <p className="text-sm text-muted-foreground">@jakobbtsh</p>
        </div>
      </CardHeader>

      {/* Stats Section */}
      <CardContent className="pb-2">
        <div className="flex justify-around py-2">
          <div className="text-center">
            <p className="text-xl font-bold">2.3k</p>
            <p className="text-xs text-muted-foreground">Follower</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">235</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">80</p>
            <p className="text-xs text-muted-foreground">Post</p>
          </div>
        </div>
      </CardContent>

    </Card>
  );
};

export default ProfileCard;