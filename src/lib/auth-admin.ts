import { jwtVerify, SignJWT } from "jose"

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET_KEY || "ecodrop_admin_secret_key_change_in_prod"
)

export async function signAdminToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET_KEY)
}

export async function verifyAdminToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY)
        return payload
    } catch (error) {
        return null
    }
}
