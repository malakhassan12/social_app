// components/RightPanel.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, X } from "lucide-react";

const RightPanel = () => {
  return (
    <div className="space-y-3">
      {/* Follow Requests - Compact */}
      <Card className="p-3">
        <CardHeader className="pb-1 px-0">
          <CardTitle className="text-xs font-semibold">
            Follow Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-0">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://github.com/shadcn.png`} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="text-xs font-medium truncate">John Doe</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    @johndoe
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 flex-shrink-0">
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <UserPlus className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested for You - Compact */}
      <Card className="p-3">
        <CardHeader className="pb-1 px-0">
          <CardTitle className="text-xs font-semibold">Suggested</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://github.com/shadcn.png`} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="text-xs font-medium truncate">Jane Smith</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    @janesmith
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[10px] px-2 flex-shrink-0"
              >
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
export default RightPanel;
