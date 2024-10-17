import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField,
  Chip,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Avatar,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalOffer as TagIcon,
  Sort as SortIcon,
} from "@mui/icons-material";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [uniqueTags, setUniqueTags] = useState([]);

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();

        // Extract unique tags
        const tags = new Set();
        data.forEach((item) => {
          if (item.tags) {
            item.tags.forEach((tag) => tags.add(tag));
          }
        });
        setUniqueTags(Array.from(tags));

        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter and sort news
  const filteredNews = news
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag === "all" || (item.tags && item.tags.includes(selectedTag));
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.publishDate) - new Date(a.publishDate);
      } else if (sortBy === "oldest") {
        return new Date(a.publishDate) - new Date(b.publishDate);
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentPageNews = filteredNews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Latest News & Updates
        </Typography>
        <Typography variant="h6">
          Stay informed about TESDA's latest announcements, programs, and
          initiatives
        </Typography>
      </Paper>

      {/* Filters and Search */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search News"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Tag</InputLabel>
            <Select
              value={selectedTag}
              onChange={handleTagChange}
              label="Filter by Tag"
              startAdornment={
                <InputAdornment position="start">
                  <TagIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Tags</MenuItem>
              {uniqueTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* News Grid */}
      {currentPageNews.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No news articles found matching your criteria.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {currentPageNews.map((item) => (
            <Grid item xs={12} md={6} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <PersonIcon />
                    </Avatar>
                  }
                  title={item.author}
                  subheader={
                    <Box
                      sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                    >
                      <CalendarIcon sx={{ fontSize: "small", mr: 0.5 }} />
                      {formatDate(item.publishDate)}
                    </Box>
                  }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.content}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {item.tags &&
                      item.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          icon={<TagIcon />}
                          sx={{ mr: 1, mb: 1 }}
                          onClick={() => setSelectedTag(tag)}
                        />
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default NewsPage;
