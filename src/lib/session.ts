import "server-only";


import crypto from "crypto";

import redis from "./redis";


const EXPIRE_TIME = 60 * 60 * 24 * 7;


export async function createSession(userId:string){

  const sessionId = crypto.randomUUID();


  await redis.set(
    `session:${sessionId}`,
    userId,
    {
      ex: EXPIRE_TIME
    }
  );


  return sessionId;
}



export async function getSession(
 sessionId:string
){

 const userId =
  await redis.get<string>(
    `session:${sessionId}`
  );


 return userId;
}



export async function deleteSession(
 sessionId:string
){

 await redis.del(
  `session:${sessionId}`
 );

}