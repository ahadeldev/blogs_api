import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../dtos/authenticated.request.dto";
import BlogsServices from "./blogs.services";
import Blog from "../../dtos/blog.dto";
import returnError from "../../utils/return.error";
import ApiResponse from "../../shared/api.response";
import httpStatusCodes from "../../shared/http.status.codes";

class BlogsControllers {
  constructor(private readonly blogsServices: BlogsServices){}

  // @desc    Create blog
  // @route   POST /api/v1/blogs/new
  // @access  Private
  async createBlogController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const blogBody: Blog = req.body;
    try {
      const blog = await this.blogsServices.createNewBlog(blogBody, verifiedUser!.id);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "BLOG CREATED", [blog]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Lis all users blogs
  // @route   GET /api/v1/blogs/all?page=pageIdx
  // @access  Public
  async listAllBlogsController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const page = req.query.page as string || "1";
    try {
      const blogsList = await this.blogsServices.listAllBlogs(page);
      const response = new ApiResponse(httpStatusCodes.OK, "ALL BLOGS", [blogsList]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Get user blogs
  // @route   GET /api/v1/blogs/my-blogs?page=pageIdx
  // @access  Private
  async getAllBlogsControllers(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const page = req.query.page as string || "1";
    try {
      const allBlogs = await this.blogsServices.getUserAllBlogs(verifiedUser!.id, page);
      const response = new ApiResponse(httpStatusCodes.OK, "BLOG CREATED", [allBlogs.blogs], allBlogs.pagination);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Get blog by id
  // @route   GET /api/v1/blogs/my-blogs/:id
  // @access  Private
  async getBlogByIdController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const blogId = req.params.id;
    try {
      const blog = await this.blogsServices.getBlogById(blogId);
      const response = new ApiResponse(httpStatusCodes.OK, "BLOG FOUND", [blog]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Update blog by id
  // @route   PUT /api/v1/blogs/my-blogs/:id
  // @access  Private
  async updateBlogByIdController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const blogId = req.params.id;
    const { newTitle, newBody } = req.body;
    try {
      const updatedBlog = await this.blogsServices.updateBlogById(blogId, verifiedUser!.id, newTitle, newBody);
      const response = new ApiResponse(httpStatusCodes.OK, "BLOG UPDATED", [updatedBlog]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }

  // @desc    Delete blog by id
  // @route   PUT /api/v1/blogs/my-blogs/:id
  // @access  Private
  async deleteBlogByIdController(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const verifiedUser = req.user;
    const blogId = req.params.id;
    try {
      const deletedBlog = await this.blogsServices.deleteBlogById(blogId, verifiedUser!.id);
      const response = new ApiResponse(httpStatusCodes.OK, "BLOG UPDATED", [deletedBlog]);
      response.send(res);
    } catch (err: any) {
      returnError(err, next);
    }
  }
}

export default BlogsControllers;