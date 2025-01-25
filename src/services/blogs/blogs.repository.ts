import { client } from "../../utils/db.utils";
import Blog from "../../dtos/blog.dto";
import BlogsWithPagination from "../../dtos/blogs.pagination.dto";
import UpdateBlog from "../../dtos/updateBlog.dto";

class BlogsRepository {
  // create a blog
  async createBlog(blogData: Blog): Promise<Blog | null>{
    const blog = await client.blog.create({data: blogData});
    return blog;
  }

  // list all blogs to the public
  async listAllBlogs(pageIdx: number): Promise<BlogsWithPagination | null>{
    const limit: number = 5;
    const offset: number = (pageIdx - 1) * limit;

    // get blogs
    const blogsList = await client.blog.findMany({
      skip: offset,
      take: limit
    });

    // pagination metadata
    const allBlogsCount = await client.blog.count(); 
    const totalPages = Math.ceil(allBlogsCount / limit);

    // construct the return response
    const blogsData: BlogsWithPagination = {
      blogs: blogsList,
      pagination: {
        currentPage: pageIdx,
        totalBlogsCount: allBlogsCount,
        totalPages
      }
    };
    return blogsData;
  }

  // get all blogs
  async getBlogs(userId: string, pageIdx: number): Promise<BlogsWithPagination | null>{
    // pagination specs
    const limit: number = 5;
    const offset: number = (pageIdx - 1) * limit;
    
    const blogs = await client.blog.findMany({
      where: { user_id: userId },
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" } // order by newer
    });

    // get pagination meta
    const totalBlogsCount = await client.blog.count({where: { user_id: userId } });
    const totalPages = Math.ceil(totalBlogsCount / limit);

    const blogsData: BlogsWithPagination = {
      blogs,
      pagination: {
        currentPage: pageIdx,
        totalBlogsCount,
        totalPages
      }
    };
    return blogsData;
  }

  // get blog by id
  async getBlogById(blogId: string): Promise<Blog | null>{
    const blog = await client.blog.findUnique({ where: { blog_id: blogId } });
    return blog;
  }

  // update blog by id
  async updateBlogById(blogId: string, userId: string, newTitle?: string, newBody?: string): Promise<Blog | null>{
    const newBlog: UpdateBlog = {};

    if(newTitle) newBlog.title = newTitle
    if(newBody) newBlog.body = newBody

    const updateBlog = await client.blog.update({
      where: {
        blog_id: blogId,
        user_id: userId
      },
      data: newBlog
    });

    return updateBlog;
  }

  // delete blog by id
  async deleteBlogById(blogId: string, userId: string): Promise<Blog | null>{
    const deletedBlog = await client.blog.delete({
      where: {
        blog_id: blogId,
        user_id: userId
      }
    });
    return deletedBlog;
  }
}

export default BlogsRepository;