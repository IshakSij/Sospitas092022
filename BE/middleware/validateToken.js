import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/userModel.js";

// takes token from request header, if no -> user not logged in
async function validateToken(req, res, next) {
    const auhorizationHeader = req.headers.authorization;
    let result;

    if (!auhorizationHeader) {
        return res.status(401).json({
            error: true,
            message: "Access token is missing",
        });
    }

    // if existing, take tokencode, jwt always sent with " "token
    const token = req.headers.authorization.split(" ")[1];

    const options = {
        expiresIn: "24h",
    };

    // find user according to his token
    try {
        let user = await User.findOne({
            accessToken: token,
        });

        if (!user) {
            result = {
                error: true,
                message: "Authorization error",
            };

            return res.status(403).json(result);
        }

        // verify, jwt does not hash, it codes it
        // jwt.verify recieves the data, check if the username matches the token from database from given user, see below
        result = jwt.verify(token, process.env.JWT_SECRET, options);

        // username same as in base
        if (!user.username === result.username) {
            result = {
                error: true,
                message: "Invalid token",
            };

            return res.status(401).json(result);
        }

        req.decoded = result;

        next(); // next function
    } catch (error) {
        console.error(error);

        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                error: true,
                message: "Token expired",
            });
        }

        return res.status(403).json({
            error: true,
            message: "Authentication error",
        });
    }
}

export default validateToken;