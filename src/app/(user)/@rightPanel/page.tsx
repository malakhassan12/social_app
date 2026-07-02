// components/RightPanel.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, X } from "lucide-react";
import Requests from "../explore/_components/Requests";
import Suggestions from "../explore/_components/Suggestions";

export const dynamic = "force-dynamic";
const RightPanel = () => {
  return (
    <div className="space-y-3">
      {/* Friend Requests */}
      <Requests rightPanel={true} />

      {/* Suggested Friends */}

      <Suggestions rightPanel={true} />
    </div>
  );
};
export default RightPanel;
