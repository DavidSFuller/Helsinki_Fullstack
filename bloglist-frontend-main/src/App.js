import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

//*******************************************************/
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  //***************
  // EVENT HANDLERS
  //***************

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  // *********************
  // Use Effect procedures
  // *********************

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      console.log("user:", user);
      blogService.setToken(user.token);
    }
  }, []);

  const queueMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }

  // ***************************************
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      queueMessage({text:"Wrong credentials", type: 'error'});
    }
  };

  // ***************************************
  const loginForm = () => {
    return (
      <div>
        <form onSubmit={handleLogin}>
          <div>
            <h2>Log in to application</h2>
            username&nbsp;
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password&nbsp;
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  };

  // ***************************************
  const ShowHeader = () => <h2>blogs</h2>;

  // ***************************************
  const handleLogout = (event) => {
    window.localStorage.removeItem("loggedBlogappUser");
  };

  // ***************************************
  const ShowUser = () => (
    <form onSubmit={handleLogout}>
      <div>
        <p>
          {user.name}&nbsp;logged in&nbsp;
          <button type="submit">logout</button>
        </p>
      </div>
    </form>
  );

  // ***************************************
  const ShowBlogs = () => (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  // ***************************************
  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = { title, author, url };
    console.log("blogObject:", blogObject);

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });
    queueMessage({text:`a new blog "${title}" by ${author} added`, type: 'info'});
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const createNew = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:&nbsp;
        <input value={title} onChange={handleTitleChange} />
        <br />
        author:&nbsp;
        <input value={author} onChange={handleAuthorChange} />
        <br />
        url:&nbsp;
        <input value={url} onChange={handleUrlChange} />
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  );

  //***********
  // Main code
  //***********
  if (user) {
    return (
      <div>
        <ShowHeader />
        <Notification message={message} />
        <ShowUser />
        {createNew()}
        <ShowBlogs />
      </div>
    );
  } else {
    return (
      <div>
        <Notification message={message} />
        {loginForm()}
      </div>
    );
  }
};

export default App;
