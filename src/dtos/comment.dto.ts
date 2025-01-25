
interface Comment {
  comment_id?: string;
  body: string; 
  blog_id: string;
  author_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export default Comment;