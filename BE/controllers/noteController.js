import User from '../models/userModel.js'

// takes from body data needed
export const addNewNote = async (req, res) => {
    const {username, title, content} = req.body

    if (!username) {
        res.status(400).json({error: "username must be provided"}).end()
        return
    }
    const user = await User.findOne({username})

    if (user) {
        const note = {title, content, timestamp: Date.now()}

        // decompose operator, returns single elements
        user.notes = [...user.notes, note]
        user.save()
        res.status(200).json({notes: user.notes})
    } else {
        res.status(400).json({error: "User does not exist"})
    }
}

// checks user, which note, new things
export const updateNote = async (req, res) => {
    const {username, timestamp, title, content} = req.body

    if (!username) {
        return res.status(400).json({error: "username must be provided"})
    }
    let user = await User.findOne({username})

    if (user) {
        // mongo, find user, update when: filter, find user, ident timestamp
        const updateResult = await User.findOneAndUpdate(
            {username, "notes.timestamp": parseInt(timestamp)},
            {$set: {'notes.$.title': title, 'notes.$.content': content}}
        )
        console.log(updateResult)
        return res.status(200).json({notes: user.notes})
    } else {
        return res.status(400).json({error: "User does not exist"})
    }
}

export const getUserNotes = async (req, res) => {
    const {username} = req.params
    if (!username) {
        res.status(400).json({error: "userId must be provided"})
        return
    }
    const user = await User.findOne({username: username})
    if (user) {
        res.status(200).json({notes: user.notes ? user.notes : []})
    } else {
        res.status(400).json({error: "User does not exist"})
    }
}


export const deleteNote = async (req, res) => {
    const {username, noteId} = req.params

    if (!username) {
        res.status(400).json({error: "username must be provided"}).end()
        return
    }
    const user = await User.findOne({username})

    if (user) {
        user.notes = user.notes.filter(note => note.timestamp !== Number(noteId))

        await User.updateOne({username}, user)
        res.status(200).json({message: "Deleted successfully", notes: user.notes})
    } else {
        res.status(400).json({error: "User does not exist"}).end()
    }
}
