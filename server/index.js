import { app } from "./src/app.js";
import { connectDB } from "./src/db/dataBase.js";

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
