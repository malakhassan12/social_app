import { Shield, FileText, Users, Lock,  } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  const sections = [
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Acceptance of Terms",
      content:
        "By using this platform, you agree to comply with these terms and conditions. If you do not agree, please do not use our services.",
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "User Accounts",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use.",
    },
    {
      icon: <Lock className="h-4 w-4" />,
      title: "Privacy Policy",
      content:
        "Your privacy is important to us. We collect and process your data according to our Privacy Policy, which is incorporated by reference.",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Content Ownership",
      content:
        "You retain ownership of the content you post. By posting, you grant us a license to display and distribute your content on our platform.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-6 w-1 bg-purple-500 rounded-full" />
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Terms & Conditions
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
                Terms & Conditions
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
              By using this platform, you agree to our terms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;