import jwt from "jsonwebtoken"

const options = {
    expiresIn: "24h",
    algorithm: 'HS256'
}

// generates token
async function generateToken(username) {
    try {
        const payload = {username};
        const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
        return {error: false, token};
    } catch (error) {
        return {error: true};
    }
}

export default generateToken;
