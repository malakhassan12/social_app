import { Lock, EyeOff } from "lucide-react";

const PrivateAccount = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 p-8 text-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Lock className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-gray-200 dark:bg-gray-700 rounded-full p-1.5">
          <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        This Account is Private
      </h2>

      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
        You need to add friend to this account to see their posts and
        activities.
      </p>
    </div>
  );
};

export default PrivateAccount;
