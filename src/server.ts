import app from "./app";
import config from "./config";

const port = config.port || 5000;

const startServer = async () => {
  try {
  } catch (error) {
    console.error("DB Error: ", error);
  }
};

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

startServer();
