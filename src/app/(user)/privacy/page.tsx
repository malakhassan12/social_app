import { Shield, Lock, Eye, Database, Cookie } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  const sections = [
    {
      icon: <Database className="h-4 w-4" />,
      title: "Data Collection",
      content:
        "We collect information you provide directly, such as when you create an account, post content, or communicate with us. This includes your name, email address, and profile information.",
    },
    {
      icon: <Eye className="h-4 w-4" />,
      title: "Data Usage",
      content:
        "We use your data to provide, improve, and personalize our services. This includes displaying content, sending notifications, and analyzing usage patterns.",
    },
    {
      icon: <Lock className="h-4 w-4" />,
      title: "Data Security",
      content:
        "We implement security measures to protect your data. However, no method of transmission over the internet is 100% secure. We strive to protect your information.",
    },
    {
      icon: <Cookie className="h-4 w-4" />,
      title: "Cookies",
      content:
        "We use cookies to enhance your experience. You can control cookie preferences in your browser settings.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-6 w-1 bg-purple-500 rounded-full" />
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Privacy Policy
        </h3>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Privacy Policy
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: January 2024
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">{section.icon}</span>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {section.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 pl-6 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              We respect your privacy. Read our full policy for more details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
