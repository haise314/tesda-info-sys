import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardHeader,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocalOffer as TagIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { formatDate } from "../utils/dateFormatter";

const fetchNews = async () => {
  const response = await axios.get("/api/news");
  return response.data;
};

const NewsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const {
    data: news,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  // Extract unique tags
  const uniqueTags = news
    ? Array.from(new Set(news.flatMap((item) => item.tags)))
    : [];

  // Filter news based on search and tag
  const filteredNews = news
    ? news.filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag =
          selectedTag === "all" ||
          (item.tags && item.tags.includes(selectedTag));
        return matchesSearch && matchesTag;
      })
    : [];

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const paginatedNews = filteredNews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading news: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="News Management"
          action={
            <Tooltip title="Refresh news">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Tag</InputLabel>
                <Select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  label="Filter by Tag"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon />
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
              <Typography variant="body2" color="text.secondary">
                Showing {paginatedNews.length} of {filteredNews.length} news
                items
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* News Table */}
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="news table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedNews.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2">{row.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.content.substring(0, 100)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(row.publishDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {row.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          icon={<TagIcon sx={{ fontSize: "16px" }} />}
                          onClick={() => setSelectedTag(tag)}
                          sx={{
                            "& .MuiChip-label": {
                              fontSize: "0.75rem",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredNews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {filteredNews.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No news items found matching your criteria.
        </Alert>
      )}
    </Box>
  );
};

export default NewsList;
