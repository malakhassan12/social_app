// prisma/seed.ts

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// ======================== CONNECTION ========================

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// ============================================================
// USER DATA
// ============================================================

const usersData = [
  {
    phone: "+201001234567",

    email: "ahmed@example.com",
    password: "hashedpassword123",

    account: {
      username: "ahmedmohamed",
      name: "Ahmed Mohamed",
      country: "Egypt",
      bio: "Full-stack developer | React & Node.js",
      image: "https://i.pravatar.cc/150?img=1",
      website: "https://ahmed.dev",
      type: "PUBLIC" as const,
    },
  },

  {
    phone: "+201009876543",

    email: "sara@example.com",
    password: "hashedpassword123",

    account: {
      username: "saraali",
      name: "Sara Ali",
      country: "Egypt",
      bio: "UI/UX designer & content creator",
      image: "https://i.pravatar.cc/150?img=2",
      website: "https://sara.design",
      type: "PUBLIC" as const,
    },
  },

  {
    phone: "+966501234567",

    email: "khaled@example.com",
    password: "hashedpassword123",

    account: {
      username: "khaledhassan",
      name: "Khaled Hassan",
      country: "Saudi Arabia",
      bio: "Backend engineer | Go & Node.js",
      image: "https://i.pravatar.cc/150?img=3",
      website: "https://khaled.dev",
      type: "PUBLIC" as const,
    },
  },

  {
    phone: "+971501234567",

    email: "mona@example.com",
    password: "hashedpassword123",

    account: {
      username: "monaibrahim",
      name: "Mona Ibrahim",
      country: "UAE",
      bio: "DevOps & cloud architect",
      image: "https://i.pravatar.cc/150?img=4",
      website: "https://mona.cloud",
      type: "PUBLIC" as const,
    },
  },

  {
    phone: "+201001112233",

    email: "youssef@example.com",
    password: "hashedpassword123",

    account: {
      username: "youssefnasser",
      name: "Youssef Nasser",
      country: "Egypt",
      bio: "Mobile developer (React Native)",
      image: "https://i.pravatar.cc/150?img=5",
      website: "https://youssef.mobile",
      type: "PUBLIC" as const,
    },
  },
];

// ============================================================
// SEED USERS
// ============================================================

async function seedUsers() {

  for (const userData of usersData) {
    // --------------------------------------------------------
    // Check if email already exists
    // --------------------------------------------------------

    const existingEmail = await prisma.userEmail.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (existingEmail) {
      continue;
    }

    // --------------------------------------------------------
    // Create User
    // --------------------------------------------------------

    const user = await prisma.user.create({
      data: {
        phone: userData.phone,
      },
    });

    // --------------------------------------------------------
    // Create UserEmail
    // --------------------------------------------------------

    const userEmail = await prisma.userEmail.create({
      data: {
        email: userData.email,
        password: userData.password,
        userId: user.id,
      },
    });

    // --------------------------------------------------------
    // Create Account
    // --------------------------------------------------------

    const account = await prisma.account.create({
      data: {
        emailId: userEmail.id,

        username: userData.account.username,
        name: userData.account.name,
        bio: userData.account.bio,
        image: userData.account.image,
        website: userData.account.website,
        country: userData.account.country,
        type: userData.account.type,
      },
    });

  
  }

}

// ============================================================
// MAIN
// ============================================================

async function main() {
  try {
    await seedUsers();
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
