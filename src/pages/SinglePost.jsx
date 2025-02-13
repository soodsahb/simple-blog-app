import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  IconButton,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await api.getPost(id);
      setPost(data);
    } catch (err) {
      toast.error('Failed to load post');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast('Please login to like posts');
      return;
    }

    try {
      const isLiked = post.likes.some(like => like._id === user.id);
      
      setPost(current => ({
        ...current,
        likes: isLiked 
          ? current.likes.filter(like => like._id !== user.id)
          : [...current.likes, { _id: user.id, username: user.username }]
      }));

      await api.toggleLike(id);
      toast.success(isLiked ? 'Post unliked' : 'Post liked');
    } catch (err) {
      toast.error('Something went wrong');
      fetchPost();
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const newComment = await api.addComment(id, comment);
      setPost(current => ({
        ...current,
        comments: [...current.comments, newComment]
      }));
      setComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(id, commentId);
      setPost(current => ({
        ...current,
        comments: current.comments.filter(c => c._id !== commentId)
      }));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.deletePost(id);
        toast.success('Post deleted successfully');
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box maxWidth="lg" sx={{ mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {post.title}
          </Typography>
          
          {user?.id === post.author._id && (
            <Box>
              <Button
                startIcon={<EditIcon />}
                onClick={() => navigate(`/edit-post/${post._id}`)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleDeletePost}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar>{post.author.username[0]}</Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1">
              {post.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <IconButton onClick={handleLike}>
            {post.likes.some(like => like._id === user?.id) ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
          <Typography variant="body2">
            {post.likes.length} likes
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Comments ({post.comments.length})
        </Typography>

        {user && (
          <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              InputProps={{
                endAdornment: (
                  <IconButton type="submit">
                    <SendIcon />
                  </IconButton>
                )
              }}
            />
          </Box>
        )}

        <List>
          {post.comments.map((comment) => (
            <ListItem
              key={comment._id}
              alignItems="flex-start"
              secondaryAction={
                user?.id === comment.author._id && (
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteComment(comment._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <Avatar>{comment.author.username[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={comment.author.username}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {comment.content}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ display: 'block' }}
                      color="text.secondary"
                    >
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SinglePost;
