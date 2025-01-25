import { Response, NextFunction } from "express";
import CommentServices from "./comments.services";
import { AuthenticatedRequest } from "../../dtos/authenticated.request.dto";
import ApiResponse from "../../shared/api.response";
import returnError from "../../utils/return.error";
import httpStatusCodes from "../../shared/http.status.codes";

class CommentsControllers {
  constructor(private readonly commentServices: CommentServices){}

  // @desc    Create new blog comment
  // @route   POST /api/v1/comments/add
  // @access  Private
  async createCommentController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const blogId = req.params.id
    const { body } = req.body
    try {
      const comment = await this.commentServices.createNewComment(verifiedUser!.id, blogId, body);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "COMMENT ADDED", [comment]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Get a blog comments
  // @route   GET /api/v1/comments/all
  // @access  Public
  async getBlogCommentsController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const blogId = req.params.id;
    try {
      const blogsComments = await this.commentServices.getBlogComments(blogId);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "ALL COMMENTS", blogsComments);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Update comment by id
  // @route   PUT /api/v1/comments/:id
  // @access  Private
  async updateCommentByIdController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const commentId = req.params.id;
    const { newBody } = req.body;
    try {
      const updatedComment = await this.commentServices.updateCommentById(commentId, verifiedUser!.id, newBody);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "COMMENT UPDATED", [updatedComment]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    } 
  }

  // @desc    Delete comment by id
  // @route   DELETE /api/v1/comments/:id
  // @access  Private
  async deleteCommentByIdController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const commentId = req.params.id;
    try {
      const deletedComment = await this.commentServices.deleteCommnetById(commentId, verifiedUser!.id);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "COMMENT DELETED", [deletedComment]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }
}

export default CommentsControllers;