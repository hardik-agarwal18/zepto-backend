import app from "./app.js";
import { ENV } from "./config/env.js";
import prisma from "./config/db.js";

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
  console.log(`Environment: ${ENV.NODE_ENV}`);
});
