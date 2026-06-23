const footerData: {
  title: string;
  path: string;
}[] = [
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Privacy",
    path: "/privacy",
  },
  {
    title: "Terms",
    path: "/terms",
  },
  {
    title: "Help",
    path: "/help",
  },
];

import {
  Cat,
  AtSign,
  PlayCircle,
} from "lucide-react";

 const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/malak",
    icon: Cat,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/malak",
    icon: AtSign,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@malak",
    icon: PlayCircle,
  },
];

export { footerData , socialLinks };
