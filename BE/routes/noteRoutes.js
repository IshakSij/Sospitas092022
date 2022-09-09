import express from "express"
import {
    addNewNote, deleteNote, getUserNotes, updateNote
} from "../controllers/noteController.js"
import validateToken from "../middleware/validateToken.js";

const router = express.Router()

// validatetoken is middleware
router.put("/add", validateToken, addNewNote)
router.delete("/delete/:username/:noteId", validateToken, deleteNote)
router.get("/get-notes/:username", validateToken, getUserNotes)
router.put("/update", validateToken, updateNote)

export default router
