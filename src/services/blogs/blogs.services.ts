import BlogsRepository from "./blogs.repository";
import Blog from "../../dtos/blog.dto";
import BlogsWithPagination from "../../dtos/blogs.pagination.dto";
import ApiError from "../../shared/api.error";
import httpStatusCodes from "../../shared/http.status.codes";

class BlogsServices {
  constructor(private readonly blogsRepository: BlogsRepository){}

  // create new blog handler
  async createNewBlog(blogBody: Blog, userId: string): Promise<Blog | null>{
    // check if the request bidy is empty
    if(Object.keys(blogBody).length === 0){
      throw new ApiError("blog data required", httpStatusCodes.BAD_REQUSEST);
    }

    // check for the required fields
    if(!blogBody.title || !blogBody.body){
      throw new ApiError("blog title and blog body are required", httpStatusCodes.UNPROCESSABLE_ENTITY);
    }

    // filling the blog required fields
    const blogData: Blog = {
      title: blogBody.title,
      body: blogBody.body,
      user_id: userId,
    };

    // saving the blog data
    const newBlog = this.blogsRepository.createBlog(blogData);
    
    if(newBlog === null){
      throw new ApiError("error saving blog", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    return newBlog;
  }

  // list all blogs handler
  async listAllBlogs(page: string): Promise<BlogsWithPagination>{
    const pageIdx: number = parseInt(page, 10);

    const blogsList = await this.blogsRepository.listAllBlogs(pageIdx);

    // check if the returned list is null
    if(blogsList === null){
      throw new ApiError("no blogs found", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    // check if the returned list has no blogs
    if(blogsList.blogs.length === 0){
      throw new ApiError("empty blogs list", httpStatusCodes.NOT_FOUND);
    }

    return blogsList;
  }

  // get user's all blogs handler
  async getUserAllBlogs(userId: string, page: string): Promise<BlogsWithPagination>{
    const pageIdx: number = parseInt(page, 10);
    const blogs = await this.blogsRepository.getBlogs(userId, pageIdx);
    if(blogs === null){
      throw new ApiError("error getting your blogs", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    if(blogs.blogs.length === 0){
      throw new ApiError("you have no blogs", httpStatusCodes.OK);
    }

    return blogs;
  }

  // get blog by id handler
  async getBlogById(blogId: string): Promise<Blog | null>{
    // validate the blog id
    if(blogId.length < 36 || blogId.length > 36){
      throw new ApiError("invalid blog id", httpStatusCodes.BAD_REQUSEST);
    }

    // find the blog by its id
    const blog = await this.blogsRepository.getBlogById(blogId);

    if(blog === null){
      throw new ApiError("blog not found", httpStatusCodes.NOT_FOUND);
    }

    return blog;
  }

  // update blog handler
  async updateBlogById(blogId: string, userId: string, newTitle?: string, newBody?: string): Promise<Blog>{
    // validate the blog id
    if(blogId.length < 36 || blogId.length > 36){
      throw new ApiError("invalid blog id", httpStatusCodes.BAD_REQUSEST);
    }
    
    // check if blog exists
    const blogExists = await this.blogsRepository.getBlogById(blogId);
    if(blogExists === null){
      throw new ApiError("blog not found", httpStatusCodes.NOT_FOUND);
    }

    // update blog
    const updatedBlog = await this.blogsRepository.updateBlogById(blogId, userId, newTitle, newBody);
    if(updatedBlog === null){
      throw new ApiError("error updating blog", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedBlog;
  }

  // delete blog handler
  async deleteBlogById(blogId: string, userId: string): Promise<Blog>{
    // validate the blog id
    if(blogId.length < 36 || blogId.length > 36){
      throw new ApiError("invalid blog id", httpStatusCodes.BAD_REQUSEST);
    }

    // check if blog exists
    const blogExists = await this.blogsRepository.getBlogById(blogId);
    if(blogExists === null){
      throw new ApiError("blog not found", httpStatusCodes.NOT_FOUND);
    }

    // delete blog
    const deletedBlog = await this.blogsRepository.deleteBlogById(blogId, userId);
    if(deletedBlog === null){
      throw new ApiError("error deleting blog", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return deletedBlog;
  }
}

export default BlogsServices;