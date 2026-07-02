// Empty State Component
const EmptyState = ({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) => (
  <div className="text-center py-12">
    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
      {icon}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      We&lsquo;ll notify you when something happens 🎉
    </p>
  </div>
);
export default EmptyState;
