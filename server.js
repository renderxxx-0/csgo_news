import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "./news.json";

function load()
{
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function save(data)
{
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/rss.json", (req, res) =>
{
    res.json({ items: load() });
});

app.post("/news", (req, res) =>
{
    let data = load();

    const item = {
        id: Date.now(),
        title: req.body.title || "No title",
        description: req.body.description || "",
        imageUrl: req.body.imageUrl || "",
        link: req.body.link || "",
        date: new Date().toISOString()
    };

    data.unshift(item);
    save(data);

    res.json({ ok: true, item });
});

app.delete("/news/:id", (req, res) =>
{
    let data = load();
    data = data.filter(n => n.id != req.params.id);
    save(data);

    res.json({ ok: true });
});

app.listen(3000, () =>
{
    console.log("RSS API running");
});
