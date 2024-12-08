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
  const primaryColor = "#0038a8";
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
      <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: primaryColor }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderTop: `6px solid ${primaryColor}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: primaryColor,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Latest News & Updates
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Stay informed about TESDA's latest announcements, programs, and
            initiatives
          </Typography>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: primaryColor }} />

        <Typography
          variant="h5"
          sx={{
            color: primaryColor,
            mb: 2,
            borderBottom: `2px solid ${primaryColor}`,
            pb: 1,
          }}
        >
          Search and Filter
        </Typography>

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
                    <SearchIcon sx={{ color: primaryColor }} />
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
                    <TagIcon sx={{ color: primaryColor }} />
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
                    <SortIcon sx={{ color: primaryColor }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: primaryColor }} />

        <Typography
          variant="h5"
          sx={{
            color: primaryColor,
            mb: 2,
            borderBottom: `2px solid ${primaryColor}`,
            pb: 1,
          }}
        >
          News Articles
        </Typography>

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
                    border: `1px solid ${primaryColor}10`,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: primaryColor }}>
                        <PersonIcon />
                      </Avatar>
                    }
                    title={item.author}
                    subheader={
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <CalendarIcon
                          sx={{
                            fontSize: "small",
                            mr: 0.5,
                            color: primaryColor,
                          }}
                        />
                        {formatDate(item.publishDate)}
                      </Box>
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: primaryColor }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
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
                            sx={{
                              mr: 1,
                              mb: 1,
                              backgroundColor: `${primaryColor}20`,
                              color: primaryColor,
                            }}
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

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: primaryColor,
                  "&.Mui-selected": {
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor,
                  },
                },
              }}
              size="large"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default NewsPage;
