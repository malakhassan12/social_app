import prisma from "@/lib/prisma";

const getAccounts = async(emailId : string) => {
  const accounts = await prisma.account.findMany({
    where: { emailId },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      type: true,
      emailId: true,
      bio: true,
      website: true,
      country: true,
      email : {
        select :{
          email : true
        }
      }
    },
  });


  return accounts
};


export default getAccounts;
