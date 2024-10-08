import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { formatDate } from "../utils/dateFormatter";

const fetchNews = async () => {
  const response = await axios.get("/api/news");
  return response.data;
};

const NewsList = () => {
  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <Typography color="error">
          Error loading news: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Latest News
        </Typography>
        <List>
          {news.slice(0, 5).map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item.content.substring(0, 100)}...
                      </Typography>
                      <Box mt={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {formatDate(item.publishDate)}
                        </Typography>
                        {item.tags.map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        ))}
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < news.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="outlined" color="primary">
            View All News
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsList;
