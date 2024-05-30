// importing necessary variables
import { app } from "./app.js";
import { connectUsingMongoose } from "./src/config/db.js";


app.listen(process.env.PORT, async () => {
  await connectUsingMongoose();
  console.log(`app is listening on ${process.env.PORT}`);
});
