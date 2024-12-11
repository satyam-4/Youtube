import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

// database connection
connectDB()  // ye ek async function hai toh promise return krega, and promise ke upr hum .then and .catch methods use kr skte hai
.then(() => {
    console.log("MongoDb Connected");
    app.listen(process.env.PORT, () => {
        console.log(`server is listening at port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDb Connection failed! :", err);
});




/* OTHER WAYS TO CONNECT DATABASE */
// first way : ye ek professional way nahi hai, kyki database se connect krte time agr kbhi connection failed ho gaya (which is possible) toh uss case ko handle nahi kiya gaya hai
/* mongoose.connect("mongodb://127.0.0.1:27017/youtube") */


// second way : isme humne error ko handle kiya hai pr 2 issues hai
//  issue1 :- database se connect krna is an asynchronous task, mtlb ki async-await ka use krna is recommended
//  issue2 :- above issue toh phir bhi solve kee jaa skti hai bss iss function ko asnyc function banana pdega, but hum agr iss normal function ke bdle iffe function ka use kre toh isey invoke krne ki jroorat bhi nahi pdegi 
/*
function connectDB() {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/youtube")
    } catch (error) {
        console.error(error)
    }
}
connectDB()  // function ko invoke krdiya
*/


// third way : using iffe, async function and wrap the connection in try catch block to handle any error 
// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

//         app.on("error", (error) => {
//             console.log(error)
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`Application is listening on port ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.error(error)
//     }
// })()