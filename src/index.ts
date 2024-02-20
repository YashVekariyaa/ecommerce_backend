import express, { Request, Response } from "express";
import connects from "./config/db";
import {router} from "./routes/routes"
import bodyParser from "body-parser";


const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use("/", router);
app.use("/profile_Image", express.static(__dirname + "/Upload/UserProfile"));
app.use("/img", express.static(__dirname + "./Upload/Products"));
app.use("/galleryimg", express.static(__dirname + "/Upload/Products/galleryImage"));


app.listen(PORT, (): void => {
  console.log(`server is running on ${PORT}`);
});

connects();