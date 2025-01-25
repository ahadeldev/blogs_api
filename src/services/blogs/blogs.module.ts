import { Router } from "express";
import BlogsRepository from "./blogs.repository";
import BlogsServices from "./blogs.services";
import BlogsControllers from "./blogs.controllers";
import authenticate from "../../middlewares/authenticate";

class BlogsModule {
  public router: Router;

  constructor(){
    // initialize blogs dependencies
    const blogsRepository = new BlogsRepository();
    const blogsServices = new BlogsServices(blogsRepository);
    const blogsControllers = new BlogsControllers(blogsServices);

    // initialize routes
    this.router = Router();

    // create new blog route
    this.router.post("/new", authenticate, blogsControllers.createBlogController.bind(blogsControllers));

    // view all blogs
    this.router.get("/all", blogsControllers.listAllBlogsController.bind(blogsControllers));
    
    // get a user's all blogs route
    this.router.get("/my-blogs", authenticate, blogsControllers.getAllBlogsControllers.bind(blogsControllers));

    // get blog my id route
    this.router.get("/my-blogs/:id", blogsControllers.getBlogByIdController.bind(blogsControllers));

    // update blog by id route
    this.router.put("/my-blogs/:id", authenticate, blogsControllers.updateBlogByIdController.bind(blogsControllers));

    // delete blog by id route
    this.router.delete("/my-blogs/:id", authenticate, blogsControllers.deleteBlogByIdController.bind(blogsControllers));
  }
}

export default BlogsModule;