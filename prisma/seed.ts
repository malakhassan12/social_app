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


// ======================== USER DATA ========================

const usersData = [
  {
    name: "Ahmed Mohamed",
    email: "ahmed@example.com",
    country: "Egypt",
    bio: "Full-stack developer | React & Node.js",
    image: "https://i.pravatar.cc/150?img=1",
    website: "https://ahmed.dev",
    password: "hashedpassword123",
    phone: "+201001234567",
  },
  {
    name: "Sara Ali",
    email: "sara@example.com",
    country: "Egypt",
    bio: "UI/UX designer & content creator",
    image: "https://i.pravatar.cc/150?img=2",
    website: "https://sara.design",
    password: "hashedpassword123",
    phone: "+201009876543",
  },
  {
    name: "Khaled Hassan",
    email: "khaled@example.com",
    country: "Saudi Arabia",
    bio: "Backend engineer | Go & Node.js",
    image: "https://i.pravatar.cc/150?img=3",
    website: "https://khaled.dev",
    password: "hashedpassword123",
    phone: "+966501234567",
  },
  {
    name: "Mona Ibrahim",
    email: "mona@example.com",
    country: "UAE",
    bio: "DevOps & cloud architect",
    image: "https://i.pravatar.cc/150?img=4",
    website: "https://mona.cloud",
    password: "hashedpassword123",
    phone: "+971501234567",
  },
  {
    name: "Youssef Nasser",
    email: "youssef@example.com",
    country: "Egypt",
    bio: "Mobile developer (React Native)",
    image: "https://i.pravatar.cc/150?img=5",
    website: "https://youssef.mobile",
    password: "hashedpassword123",
    phone: "+201001112233",
  },
];


// ======================== SEED USERS ========================


async function seedUsers() {

  console.log("🌱 Seeding users...");


  for (const user of usersData) {


    const existingUser = await prisma.user.findUnique({
      where:{
        email:user.email,
      },
    });



    if(existingUser){

      console.log(
        `⏩ User already exists: ${user.email}`
      );

      continue;
    }



    await prisma.user.create({
      data:user,
    });



    console.log(
      `✅ Created user: ${user.name}`
    );

  }


  console.log("✅ Users seeding completed!");

}



// ======================== MAIN ========================


async function main(){

  try {

    await seedUsers();


  } catch(error){

    console.error(
      "❌ Error seeding users:",
      error
    );


  } finally {


    await prisma.$disconnect();


  }

}



main();