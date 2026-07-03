// components/RightPanel.tsx
import { Suspense } from "react";
import Requests from "../explore/_components/Requests";
import Suggestions from "../explore/_components/Suggestions";
import SuggestionsSkeleton from "@/components/Skelton/SuggestionsSkeleton";

const RightPanel = () => {
  return (
    <div className="space-y-3">
      {/* Friend Requests */}
      <Requests rightPanel={true} />

      {/* Suggested Friends */}

      <Suspense fallback={<SuggestionsSkeleton />}>
        <Suggestions rightPanel={true} />
      </Suspense>
    </div>
  );
};
export default RightPanel;
