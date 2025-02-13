import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await api.getPost(id);
        
        // Check if user is the author
        if (user.id !== post.author._id) {
          toast.error('You are not authorized to edit this post');
          navigate('/');
          return;
        }

        setFormData({
          title: post.title,
          content: post.content
        });
      } catch (error) {
        toast.error('Failed to load post');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setUpdating(true);
    try {
      await api.updatePost(id, formData);
      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update post');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          mt: 4 
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 4,
            textAlign: 'center'
          }}
        >
          Edit Post
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your post title"
            inputProps={{ maxLength: 100 }}
            helperText={`${formData.title.length}/100 characters`}
          />

          <TextField
            name="content"
            label="Content"
            value={formData.content}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Write your post content here..."
            inputProps={{ maxLength: 5000 }}
            helperText={`${formData.content.length}/5000 characters`}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={updating}
              endIcon={<SendIcon />}
              sx={{ 
                flex: 1,
                py: 1.5,
                fontWeight: 600
              }}
            >
              {updating ? 'Updating...' : 'Update Post'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(`/post/${id}`)}
              sx={{ 
                flex: 1,
                py: 1.5
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditPost;
