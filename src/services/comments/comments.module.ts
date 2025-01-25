import { Router } from "express";
import authenticate from "../../middlewares/authenticate";
import CommentsRepository from "./comments.repository";
import CommentServices from "./comments.services";
import CommentsControllers from "./comments.controllers";
import BlogsRepository from "../blogs/blogs.repository";

class CommentsModule {
  public router: Router;
  
  constructor(){
    // initialize comments dependencies
    const blogsRepository = new BlogsRepository()
    const commentsRepository = new CommentsRepository();
    const commentServices = new CommentServices(commentsRepository, blogsRepository);
    const commentsControllers = new CommentsControllers(commentServices);

    // initialize routes
    this.router = Router();

    // create new comment route
    this.router.post("/:id", authenticate, commentsControllers.createCommentController.bind(commentsControllers));

    // get a blog comments rouete
    this.router.get("/:id", commentsControllers.getBlogCommentsController.bind(commentsControllers));

    // update comment by id route
    this.router.put("/:id", authenticate, commentsControllers.updateCommentByIdController.bind(commentsControllers));

    // delete comment by id route
    this.router.delete("/:id", authenticate, commentsControllers.deleteCommentByIdController.bind(commentsControllers));
  }
}

export default CommentsModule;