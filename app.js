const express = require("express");
const path = require("path");
const app = express();
const api_key = require("./details.js");
const PORT = process.env.Port || 8082;
app.use(express.static(path.join(__dirname)));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { corrected: " ", orginalText: " " });
});

//main route
app.post("/correct", async (req, res) => {
  const text1 = req.body.text.trim();
  if (!text1) {
    res.render("index.ejs", {
      corrected: "Please enter the content, Wating to help you.",
      orginalText: "Please enter the text",
    });
  }
  try {
    const response1 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Correct the following content grammatically and with proper punctuation. Ensure the sentences are well-structured, clear, and natural in English. Maintain the original meaning while improving readability and fluency. Make sure all grammar, punctuation, and sentence structure errors are corrected for perfect English. Do not change the meaning or add extra information. Just refine it to be grammatically flawless and well-written,but without any extra sentence the response should only contain the corrected sentence. Here is the text: ${text1}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response1.ok) {
      res.render("index.ejs", {
        corrected: "Server low, please try again",
        orginalText: text1,
      });
    }
    const data = await response1.json();
    console.log(data.candidates[0].content.parts[0].text);
    res.render("index.ejs", {
      corrected: data.candidates[0].content.parts[0].text,
      orginalText: text1,
    });
  } catch (error) {
    res.render("index.ejs", {
      corrected: "Server low, please try again",
      orginalText: text1,
    });
  }
});

app.use((req, res, next) => {
  res.send("Page not found, please try again");
});

app.listen(PORT, () => {
  console.log(`the server is hosted on http://localhost:${PORT}`);
});
