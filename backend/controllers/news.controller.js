import News from "../models/news.model.js";

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ publishDate: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ message: "News not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNews = async (req, res) => {
  const news = new News({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    tags: req.body.tags,
  });

  try {
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      Object.assign(news, req.body);
      const updatedNews = await news.save();
      res.json(updatedNews);
    } else {
      res.status(404).json({ message: "News not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      await news.remove();
      res.json({ message: "News deleted successfully" });
    } else {
      res.status(404).json({ message: "News not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
