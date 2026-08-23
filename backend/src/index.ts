import { createHoroscopeServer } from "./http/horoscopeServer.js";

const port = Number(process.env.PORT ?? 3001);
const server = createHoroscopeServer();

server.listen(port, () => {
  console.log(`Horoscope backend running at http://localhost:${port}`);
});
