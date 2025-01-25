import Comment from "../../dtos/comment.dto";
import { client } from "../../utils/db.utils";

class CommentsRepository {
  // create a comment
  async createComment(commentDetails: Comment): Promise<Comment>{
    const comment = await client.comment.create({
      data: commentDetails
    });
    return comment;
  }

  // get the blog comments
  async getCommentsByBlogId(blogId: string): Promise<Comment[]>{
    const blogsComments = await client.comment.findMany({
      where: {
        blog_id: blogId
      }
    });
    return blogsComments;
  }

  // get comment by id
  async getCommentById(commentId: string): Promise<Comment | null>{
    const comment = await client.comment.findUnique({
      where: { comment_id: commentId}
    });
    return comment;
  }

  // update comment by id
  async updateComment(commentId: string, authorId: string, newBody: string): Promise<Comment>{
    const updatedComment = await client.comment.update({
      where: { comment_id: commentId, author_id: authorId },
      data: { body: newBody }
    });
    return updatedComment;
  }

  // delete comment by id
  async deleteComment(commentId: string, authorId: string): Promise<Comment>{
    const deletedComment = await client.comment.delete({
      where: {
        comment_id: commentId,
        author_id: authorId
      }
    });
    return deletedComment;
  }
}

export default CommentsRepository;