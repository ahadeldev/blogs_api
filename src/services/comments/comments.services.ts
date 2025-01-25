import Comment from "../../dtos/comment.dto";
import CommentsRepository from "./comments.repository";
import BlogsRepository from "../blogs/blogs.repository";
import ApiError from "../../shared/api.error";
import httpStatusCodes from "../..//shared/http.status.codes";

class CommentServices {
  constructor(
    private readonly commentsRepository: CommentsRepository, 
    private readonly blogsRepository: BlogsRepository){}

  // create new comment handler
  async createNewComment(authorId: string, blogId: string, commentBody: string){
    // check for the blog necessary attributes
    if(!authorId || ! blogId || !commentBody){
      throw new ApiError("comment atrributes missing", httpStatusCodes.UNPROCESSABLE_ENTITY);
    }

    if(commentBody.length === 0){
      throw new ApiError("comment can not be an empty", httpStatusCodes.BAD_REQUSEST);
    }
 
    // validate the blog id
    if(blogId.length < 36 || blogId.length > 36){
      throw new ApiError("invalid blog id", httpStatusCodes.BAD_REQUSEST);
    }

    // check for the blog by id
    const blogExists = await this.blogsRepository.getBlogById(blogId);
    if(!blogExists){
      throw new ApiError("blog not found", httpStatusCodes.BAD_REQUSEST);
    }

    const comment: Comment = {
      body: commentBody,
      blog_id: blogId,
      author_id: authorId
    };
    
    const newComment = await this.commentsRepository.createComment(comment);
    if(!newComment){
      throw new ApiError("comment not posted", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return newComment;
  }

  // get all comments for a specific blog
  async getBlogComments(blogId: string){
    // validate the blog id
    if(blogId.length < 36 || blogId.length > 36){
      throw new ApiError("invalid blog id", httpStatusCodes.BAD_REQUSEST);
    }

    // check for the blog by id
    const blogExists = this.blogsRepository.getBlogById(blogId);
    if(!blogExists){
      throw new ApiError("blog not found", httpStatusCodes.BAD_REQUSEST);
    }

    // get the comments
    const blogsComments = await this.commentsRepository.getCommentsByBlogId(blogId);
    if(!blogsComments){
      throw new ApiError("error getting blog comments", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    
    return blogsComments;
  }

  // update comment by id
  async updateCommentById(commentId: string, authorId: string, newBody: string){
    // validate the comment id
    if(commentId.length < 36 || commentId.length > 36){
      throw new ApiError("invalid comment id", httpStatusCodes.BAD_REQUSEST);
    }

    // check for the new comment body
    if(!newBody){
      throw new ApiError("please provide new comment", httpStatusCodes.NOT_FOUND);
    }

    // check if comment exists
    const commentExists = await this.commentsRepository.getCommentById(commentId);
    if(!commentExists){
      throw new ApiError("comment not found", httpStatusCodes.NOT_FOUND);
    }

    if(newBody.length === 0){
      throw new ApiError("new comment can not be an empty string", httpStatusCodes.BAD_REQUSEST);
    }

    const updatedComment = await this.commentsRepository.updateComment(commentId, authorId, newBody);
    if(!updatedComment){
      throw new ApiError("error updating comment", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedComment;
  }

  // delete comment by id handler
  async deleteCommnetById(commentId: string, authorId: string){
    // validate the comment id
    if(commentId.length < 36 || commentId.length > 36){
      throw new ApiError("invalid comment id", httpStatusCodes.BAD_REQUSEST);
    }

    // check if comment exists
    const commentExists = await this.commentsRepository.getCommentById(commentId);
    if(!commentExists){
      throw new ApiError("comment not found", httpStatusCodes.NOT_FOUND);
    }

    const deletedComment = await this.commentsRepository.deleteComment(commentId, authorId);
    if(!deletedComment){
      throw new ApiError("error deleting comment", httpStatusCodes.NOT_FOUND);
    }

    return deletedComment;
  }
}

export default CommentServices;