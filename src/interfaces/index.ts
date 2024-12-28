import { JwtPayload } from "jsonwebtoken";

export interface User {
    id: number;
    email: string;
    password: string;
    created_at: Date;
}

export interface CustomJwtPayload extends JwtPayload {
    id: number
}