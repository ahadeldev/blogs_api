import Blog from "./blog.dto";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalBlogsCount: number;
}

interface BlogsWithPagination {
  pagination: Pagination;
  blogs: Blog[];
}

export default BlogsWithPagination;