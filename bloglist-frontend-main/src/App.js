import { useState, useEffect, useRef } from "react";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import ShowBlogs from "./components/ShowBlogs";
import Togglable from "./components/Togglable";
import NewBlogForm from "./components/NewBlogForm";

const sortBlogs = (blogs) => blogs.sort((a, b) => b.likes - a.likes);

//*******************************************************/
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // *********************
  // Use Effect procedures
  // *********************

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortBlogs(blogs)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const logMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  // ***************************************
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const loginuser = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loginuser)
      );
      blogService.setToken(loginuser.token);
      setUser(loginuser);
      setUsername("");
      setPassword("");
    } catch (exception) {
      logMessage({ text: "Wrong credentials", type: "error" });
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

  const blogFormRef = useRef();
  const bloghideRef = useRef();

  // ***************************************
  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      if (returnedBlog === undefined) {
        logMessage({ text: "failed to add blog", type: "error" });
      } else if (returnedBlog === null) {
        logMessage({
          text: "Login expired. Please log in again.",
          type: "warning",
        });
        handleLogout();
        setUser(null);
      } else {
        const newBlog = { ...returnedBlog, user: user };
        setBlogs(blogs.concat(newBlog));
        logMessage({
          text: `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
          type: "info",
        });
        blogFormRef.current.toggleVisibility();
      }
    });
  };

  // ***************************************
  const likeit = (blogObject) => {
    blogService
      .update(blogObject.id, { likes: blogObject.likes + 1 })
      .then((status) => {
        if (status === 200) {
          const newBlog = { ...blogObject, likes: blogObject.likes + 1 };
          setBlogs(
            sortBlogs(
              blogs.map((blog) => (blog.id === blogObject.id ? newBlog : blog))
            )
          );
        } else if (status === 401) {
          logMessage({
            text: "Login expired. Please log in again.",
            type: "warning",
          });
          handleLogout();
          setUser(null);
        } else {
          logMessage({
            text: `could not update likes (${status})`,
            type: "error",
          });
        }
      });
  };

  const deleteBlog = (blogObject) => {
    if (
      window.confirm(
        `Remove blog "${blogObject.title}" by ${blogObject.author}?`
      )
    ) {
      blogService.remove(blogObject.id).then((status) => {
        console.log("status:", status);
        if (status === 204) {
          setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));
          bloghideRef.current.toggleOff(blogObject.id);
          logMessage({
            text: `Blog "${blogObject.title}" by ${blogObject.author} removed.`,
            type: "info",
          });
        } else if (status === 401) {
          logMessage({
            text: "Login expired. please log in again.",
            type: "warning",
          });
          handleLogout();
          setUser(null);
        } else {
          logMessage({ text: `blog was not removed.${status}`, type: "error" });
        }
      });
    }
  };

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <NewBlogForm createBlog={addBlog} />
    </Togglable>
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
        {blogForm()}
        <ShowBlogs
          blogs={blogs}
          likeFn={likeit}
          delFn={deleteBlog}
          username={user.username}
          ref={bloghideRef}
        />
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
