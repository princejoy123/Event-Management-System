import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_round: Number(process.env.BCRYPT_SALT_ROUND),
    super_admin_email: process.env.SUPER_ADMIN_EMAIL,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    jwt:{
        jwt_secret: process.env.JWT_SECRET,
        jwt_expiresin: process.env.JWT_EXPIRESIN,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_refresh_expiresin: process.env.JWT_REFRESH_EXPIRESIN
    },
    cloudinary:{
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    },
    stripe: {
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    }
}