
interface Blog {
  blog_id?: string;
  title: string;
  body: string;
  user_id: string;
  created_at?: Date,
  updated_at?: Date
}

export default Blog;