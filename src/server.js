import express from "express";
import cors from 'cors';
import apiRoutes from "./routes/index.js";

const app = express();
// app.use(deserializeUser);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', apiRoutes);
app.listen(4000, () => {
    console.log(`Server listing at http://${'localhost'}:${4000}`);
});