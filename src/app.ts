import express from "express";


const app = express();
app.use(express.json());


// Health Route
import HealthRoute from "./modules/health/routes/health.routes";
app.use("/api/v1/health", HealthRoute);

// Auth Route
import AuthRoute from "./modules/auth/routes/auth.routes";
app.use("/api/v1/auth", AuthRoute);

app.get("/", (req, res) => {
    res.status(200).json({
        message:"ok"
    })
})


export default app;