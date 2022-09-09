import User from '../models/userModel.js'

// takes from body data needed, username, title, content
export const addNewNote = async (req, res) => {
    const {username, title, content} = req.body

    if (!username) {
        res.status(400).json({error: "username must be provided"}).end()
        return
    }
    const user = await User.findOne({username})

    // timestamp generated when note made, so we can identify it
    if (user) {
        const note = {title, content, timestamp: Date.now()}

        // decompose operator, returns single elements, instead of sequence, sends every element individually
        user.notes = [...user.notes, note]
        user.save()
        res.status(200).json({notes: user.notes})
    } else {
        res.status(400).json({error: "User does not exist"})
    }
}

// checks user, which note identified by timestamp, new things
export const updateNote = async (req, res) => {
    const {username, timestamp, title, content} = req.body

    if (!username) {
        return res.status(400).json({error: "username must be provided"})
    }
    let user = await User.findOne({username})

    if (user) {
        // mongo magic, find user, update when: filter, find user, ident timestamp, if matching, update with data from body
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

// return note if all identifiers matching
export const getUserNotes = async (req, res) => {
    const {username} = req.params
    if (!username) {
        res.status(400).json({error: "userId must be provided"})
        return
    }
    const user = await User.findOne({username: username})
    if (user) {
        res.status(200).json({notes: user.notes ? user.notes : []}) // if empty, send empty array
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
