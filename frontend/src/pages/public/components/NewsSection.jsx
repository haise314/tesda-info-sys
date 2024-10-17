import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { AnnouncementOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        // Limit to 3 most recent news items
        setNews(data.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <Typography>Loading news...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">
            <AnnouncementOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
            Latest News and Updates
          </Typography>
          <Button component={Link} to="/news" size="small" color="primary">
            View All News
          </Button>
        </Box>
        <List>
          {news.map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="News" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {new Date(item.publishDate).toLocaleDateString()}
                      </Typography>
                      {` — ${item.content}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < news.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
