import { Spinner } from "../ui/spinner";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <Spinner className="h-5 w-5 text-primary" />
    </div>
  );
}
