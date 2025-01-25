import { CorsOptions } from "cors";

interface CorsConfigDto extends CorsOptions{
  origin: string | string[]
  methods: string[]
  allowedHeaders: string[]
  credentials:boolean
}

export default CorsConfigDto;