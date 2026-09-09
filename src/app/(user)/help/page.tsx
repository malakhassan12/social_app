import { Mail, MessageCircle, FileText, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Help = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-6 w-1 bg-purple-500 rounded-full" />
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Help Center
        </h3>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group">
              <FileText className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                FAQ
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group">
              <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Live Chat
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group">
              <Mail className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Email
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group">
              <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Guide
              </span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Need more help? Contact us at{" "}
              <a
                href="mailto:support@example.com"
                className="text-purple-500 hover:text-purple-600 font-medium"
              >
                support@example.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
