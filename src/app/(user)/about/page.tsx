import BackBtn from "@/components/Buttons/BackBtn";
import { User, MapPin, Calendar, Briefcase, Link as LinkIcon } from "lucide-react";

const About = () => {
  // Mock user data - replace with actual data
  const user = {
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    bio: "Passionate developer and designer. Building amazing things on the web.",
    location: "San Francisco, CA",
    joinedDate: "January 2024",
    occupation: "Full Stack Developer",
    website: "https://johndoe.dev",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <BackBtn />

      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-6 w-1 bg-purple-500 rounded-full" />
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          About
        </h3>
      </div>

      {/* Bio Card */}
      <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <User className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              @{user.username}
            </p>
          </div>
        </div>

        {user.bio ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {user.bio}
          </p>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            No bio available yet.
          </p>
        )}

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {user.location && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              {user.location}
            </p>
          )}
          {user.occupation && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-gray-400" />
              {user.occupation}
            </p>
          )}
          {user.joinedDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              Joined {user.joinedDate}
            </p>
          )}
          {user.website && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <LinkIcon className="h-3.5 w-3.5 text-gray-400" />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-600 hover:underline transition-colors"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;