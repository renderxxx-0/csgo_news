import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const DB_FILE = "./news.json";

// загрузка
function loadNews()
{
    if (!fs.existsSync(DB_FILE))
        return [];

    return JSON.parse(fs.readFileSync(DB_FILE));
}

// сохранение
function saveNews(data)
{
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 📌 получить RSS (JSON)
app.get("/rss.json", (req, res) =>
{
    const news = loadNews();

    res.json({
        items: news
    });
});

// 📌 добавить новость
app.post("/news", (req, res) =>
{
    const news = loadNews();

    const item = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description || "",
        imageUrl: req.body.imageUrl || "",
        date: new Date().toISOString(),
        link: req.body.link || ""
    };

    news.unshift(item);

    saveNews(news);

    res.json({ ok: true, item });
});

// 📌 удалить новость
app.delete("/news/:id", (req, res) =>
{
    let news = loadNews();

    news = news.filter(n => n.id != req.params.id);

    saveNews(news);

    res.json({ ok: true });
});

app.listen(3000, () =>
{
    console.log("RSS server running");
});
