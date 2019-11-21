import { app } from "./app";
import "./saying";

(async () => {
    await app.start(process.env.PORT || 3000);
})();

