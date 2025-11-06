import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// allow React dev server to talk to this backend
app.use(cors({
  origin: "http://localhost:3000",
}));

app.use(bodyParser.json());

// POST /api/exchange-token
// Frontend gives us the ?code=... from the redirect
// We trade that code for an access_token using our client_secret
app.post("/api/exchange-token", async (req, res) => {
  const { code } = req.body;

  try {
    const tokenRes = await fetch("https://api.figma.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.FIGMA_CLIENT_ID,
        client_secret: process.env.FIGMA_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson = await tokenRes.json();
    console.log("tokenJson:", tokenJson);

    res.json(tokenJson); // send tokens/access_token back to frontend
  } catch (err) {
    console.error("Token exchange failed:", err);
    res.status(500).json({ error: "token exchange failed" });
  }
});

// POST /api/get-figma-file
// Frontend gives us access_token + file_key
// We call Figma's /files/:key to get the design JSON
app.post("/api/get-figma-file", async (req, res) => {
  const { access_token, file_key } = req.body;

  try {
    const figmaRes = await fetch(`https://api.figma.com/v1/files/${file_key}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const figmaJson = await figmaRes.json();
    res.json(figmaJson);
  } catch (err) {
    console.error("File fetch failed:", err);
    res.status(500).json({ error: "file fetch failed" });
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
