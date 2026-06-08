import http, { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import sendJson from "./utils/sendJson.js";
import { checkValidSession, deleteSession, insertSession } from "./services/sessions.js";
import { insertConfession } from "./services/insertConfession.js";
import { Confession } from "./types/confession.js";
import { handleAuthCallback } from "./routes/auth.js";
import { generateSessionId, parseCookies } from "./utils/auth.js";

const PORT = Number(process.env.PORT) || 8080;

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (!req.url || !req.headers.host) {
        return sendJson(res, 400, { error: "Bad request" });
      }

      const url = new URL(req.url, `http://${req.headers.host}`);

      console.log(url.pathname, req.method);

      if (!url.pathname.startsWith("/api")) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not Found");
      }

      url.pathname = url.pathname.slice(4) || "/";

      if (url.pathname === "/healthz") {
        return sendJson(res, 200, { ok: true });
      }

      if (url.pathname.startsWith("/auth")) {
        return handleAuthCallback(req, res, url);
      }

      if (url.pathname === "/confession") {
        if (req.method === "GET") {
          const sessionId = generateSessionId();

          res.setHeader("Set-Cookie", [
              `session_id=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax;`
          ]);

          await insertSession(sessionId);

          return sendJson(res, 200, { sessionId });
        } else if (req.method === "POST") {
          const cookies = parseCookies(req);

          const sessionId = cookies.session_id;
          if (!sessionId) {
            return sendJson(res, 401, { error: "Unauthorized" });
          }
          const isValidSession = await checkValidSession(sessionId);
          if (!isValidSession) {
            return sendJson(res, 401, { error: "Unauthorized" });
          }
          const body = req.read();
          if (!body) {
            return sendJson(res, 400, { error: "Bad request" });
          }
          const confessionData = JSON.parse(body.toString()) as Confession;
          if (!confessionData.text) {
            return sendJson(res, 400, { error: "Confession text is required" });
          }

          await insertConfession(confessionData);
          await deleteSession(sessionId);

          return sendJson(res, 201, { message: "Confession submitted successfully" });
        } else {
          return sendJson(res, 405, { error: "Method not allowed" });
        }
      }

      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: "Internal server error" });
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});