import mongoose from "mongoose"
// asynchron to connect to base
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://enes:enes123@cluster0.mfscmxb.mongodb.net/?retryWrites=true&w=majority")
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
