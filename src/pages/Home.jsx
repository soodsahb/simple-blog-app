import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Skeleton,
  IconButton,
  Box,
  Pagination,
  Container,
} from "@mui/material";
import { Favorite, FavoriteBorder, Comment } from "@mui/icons-material";
import toast from "react-hot-toast";
import { keyframes } from "@emotion/react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

const likeAnimation = keyframes`
  0% { transform: scale(1) }
  25% { transform: scale(1.2) }
  50% { transform: scale(0.95) }
  100% { transform: scale(1) }
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Pagination states
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      toast("Please login to like posts");
      return;
    }

    try {
      const isLiked = posts
        .find((post) => post._id === postId)
        .likes.some((like) => like._id === user.id);

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((like) => like._id !== user.id)
                : [...post.likes, { _id: user.id, username: user.username }],
            };
          }
          return post;
        })
      );

      await api.toggleLike(postId);
      toast.success(isLiked ? "Post unliked" : "Post liked");
    } catch (err) {
      toast.error("Something went wrong");
      fetchPosts(); // Revert on error
    }
  };

  // Get current posts for pagination
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 4,
        }}
      >
        Latest Blog Posts
      </Typography>

      <Grid container spacing={4}>
        {currentPosts.map((post) => (
          <Grid item xs={12} md={4} key={post._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.content}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    mt: "auto",
                    color: "text.secondary",
                  }}
                >
                  By {post.author.username} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleLike(post._id)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(233, 30, 99, 0.1)",
                      },
                      animation: post.likes.some((like) => like._id === user?.id)
                        ? `${likeAnimation} 0.5s ease-in-out`
                        : "none",
                    }}
                  >
                    {post.likes.some((like) => like._id === user?.id) ? (
                      <Favorite
                        fontSize="small"
                        sx={{
                          color: "error.main",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ) : (
                      <FavoriteBorder
                        fontSize="small"
                        sx={{ transition: "all 0.3s ease" }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 1,
                        color: post.likes.some((like) => like._id === user?.id)
                          ? "error.main"
                          : "text.secondary",
                      }}
                    >
                      {post.likes.length}
                    </Typography>
                  </IconButton>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <Comment fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {post.comments.length}
                    </Typography>
                  </IconButton>
                </Box>
                <Button
                  size="small"
                  component={Link}
                  to={`/post/${post._id}`}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
            mb: 4,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default Home;
