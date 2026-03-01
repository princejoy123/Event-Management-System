import * as bcrypt from 'bcryptjs';
import config from "../config";
import { prisma } from '../shared/prisma';
import { UserRole } from '../../../prisma/generated/enums';

const seedSuperAdmin = async () => {
    try {

        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPER_ADMIN
            }
        });

        if (isExistSuperAdmin) {
            console.log("✅ Super admin already exists!");
            return isExistSuperAdmin;
        }

        const saltRounds = Number(config.bcrypt_salt_round) || 12;
        const hashedPassword = await bcrypt.hash(
            config.super_admin_password!,
            saltRounds
        );

        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.create({
                data: {
                    name: "Abu Saiyed Joy",
                    email: config.super_admin_email!,
                    password: hashedPassword,
                    role: UserRole.SUPER_ADMIN
                }
            });

            const superAdminData = await tx.admin.create({
                data: {
                    userId: user.id,
                    contactNumber: "01988084185"
                }
            });

            console.log("Super Admin Created Successfully!");

            return {
                user,
                admin: superAdminData
            };
        });

        return result;

    } catch (error) {
        console.error("Error seeding super admin:", error);
        throw error;
    }
};

export default seedSuperAdmin;