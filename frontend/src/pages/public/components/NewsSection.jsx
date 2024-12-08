import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { NewReleases } from "@mui/icons-material";
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

  if (loading)
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Loading news...
          </Typography>
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card>
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );

  return (
    <Card
      elevation={3}
      sx={{
        width: "100%", // Changed from maxWidth to full width
        margin: "auto",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            <NewReleases sx={{ mr: 1, fontSize: 24 }} />
            Latest Updates
          </Typography>
          <Button
            component={Link}
            to="/news"
            size="small"
            variant="outlined"
            color="primary"
          >
            View All
          </Button>
        </Box>
        <List disablePadding>
          {news.map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem
                disableGutters
                sx={{
                  py: 2,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.publishDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.content}
                </Typography>
              </ListItem>
              {index < news.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
