const blogRouter = require("express").Router();
const Blog = require("../models/bloglist");
const logger = require("../utils/logger");
const middleware = require("../utils/middleware");

//******************************************************************************************** */
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

//******************************************************************************************** */
blogRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  if (request.user === undefined) {
    return response.status(401).json({ error: "login required" });
  }
  if (request.user === null) {
    return response.status(401).json({ error: "login invalid" });
  }

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });
  logger.info("blog is ", blog);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

//******************************************************************************************** */
blogRouter.get("/:id", async (request, response) => {
  logger.info("by id:", request.params.id);
  const blogs = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

//******************************************************************************************** */
blogRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    if (request.user === undefined) {
      return response.status(401).json({ error: "login required" });
    }
    if (request.user === null) {
      return response.status(401).json({ error: "login invalid" });
    }

    const user = request.user;

    // get user of the blog entry - must match that for the session
    const oldBlog = await Blog.findById(request.params.id);
    logger.info("oldBlog.user.id:", oldBlog.user._id.valueOf());
    logger.info("user:", user);
    if (oldBlog) {
      if (oldBlog.user._id.valueOf() !== user.id) {
        return response
          .status(401)
          .json({ error: "user cannot delete this row" });
      }

      await Blog.findByIdAndRemove(request.params.id);

      user.blogs = user.blogs.filter((b) => b.valueOf() !== request.params.id);
      await user.save();
      response.status(204).end();
    } else {
      response.status(400).json({ error: "bloglist entry no longer exists" });
    }
  }
);

//******************************************************************************************** */
blogRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const newBlog = request.body;

  if (request.user === undefined) {
    return response.status(401).json({ error: "login required" });
  }
  if (request.user === null) {
    return response.status(401).json({ error: "login invalid" });
  }

  const user = request.user;

  // Special case if only update is to 'likes' which anyone can update
  if (
    newBlog.title !== undefined ||
    newBlog.author !== undefined ||
    newBlog.url !== undefined
  ) {
    // get user of the blog entry - must match that for the session
    const oldBlog = await Blog.findById(request.params.id); //.populate('user', { username: 1, name: 1 })
    if (oldBlog.user._id.valueOf() !== user.id) {
      return response
        .status(401)
        .json({ error: "user cannot update this row" });
    }
  }
  /**********
  const blog = {
    ...(newBlog.title && {title: newBlog.title}),
    ...(newBlog.author && {author: newBlog.author}),
    ...(newBlog.url && {url: newBlog.url}),
    ...((newBlog.likes || newBlog.likes === 0) && {likes: newBlog.likes})
  }
  **********/
  const blog = {
    title: newBlog.title,
    author: newBlog.author,
    url: newBlog.url,
    likes: newBlog.likes,
  };

  logger.info("Update to:", request.params.id, blog);
  const result = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(result);
});

module.exports = blogRouter;
