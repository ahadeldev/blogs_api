import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const testDatabaseConnection = async (): Promise<void> => {
  try {
    await client.$connect();
    console.log("==> Database connected successfully");
  } catch (err) {
    console.log("==> Error connecting to database", err);
    process.exit(1);
  }
}

export { client, testDatabaseConnection };