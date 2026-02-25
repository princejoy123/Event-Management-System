import { PrismaPg } from "@prisma/adapter-pg"
import {PrismaClient} from "../../../prisma/generated/client"
import config from "../config";


const connectionString = config.database_url as string

const adapter = new PrismaPg({connectionString})

export const prisma = new PrismaClient({
    adapter
});
