import dotenv from "dotenv";
import CorsConfigDto from "../dtos/corsOptions.dto";

dotenv.config();
const corsConfig: CorsConfigDto = {
  origin: process.env.NODE_ENV === "development" ? '*' : [ process.env.FRONTEND_DOMAIN ?? ""],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

export default corsConfig;