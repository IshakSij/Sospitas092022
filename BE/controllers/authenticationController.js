import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// with req, res
export const login = async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username: username})

    if (!user) {
        res.status(401).json({
            success: false,
            user: null,
            message: 'No user with given username found!'
        }).end()
        return
    }
    const isPasswordTrue = await user.matchPassword(password)
    if (isPasswordTrue) {
        const {error, token} = await generateToken(user.username);

        if (error) {
            return res.status(500).json({
                success: false,
                error: true,
                message: "Couldn't create access token. Please try again later.",
            });
        }

        user.accessToken = token;

        await user.save();
        res.status(200).json({
            success: true,
            userId: user._id.toString(),
            username: user.username,
            token,
            message: 'User successfully logged in'
        }).end()
        return
    }
    res.status(401).json({
        message: "Username and password combo is not correct!"
    }).end()
}

// validation
export const register = async (req, res) => {
    const {username, password, repeatPassword} = req.body
    //validate input data
    let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!username || spChars.test(username)) {
        res.status(400).json({
            success: false,
            message: "User must have username and can't contain special characters"
        })
        return
    } else if (!password || password !== repeatPassword) {
        res.status(400).json({
            success: false,
            message: "Password not provided or repeated password not the same"
        }).end()
        return
    }
    let user;
    try {
        user = new User({username, password})
        await user.save()
    } catch (e) {
        res.status(400).json({
            success: false,
            message: "User already exists"
        }).end()
        return
    }
    // response
    res.status(200).json({username: user.username, id: user._id.toString()}).end()
}

export const logout = async (req, res) => {
    try {
        const {username} = req.decoded;

        let user = await User.findOne({username});

        user.accessToken = "";

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User logged out",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: true,
            message: error,
        });
    }
}
