import { useState, useImperativeHandle, forwardRef } from "react";
const ShowBlogs = forwardRef((props, ref) => {
  const [showDetail, setShowDetail] = useState([]);
  const { blogs, likeFn, delFn, username } = props;

  const toggleOff = (blogId) => {
    const shows = showDetail.filter((x) => x.id !== blogId);
    setShowDetail(shows);
  };

  const toggleOn = (blogId) => {
    const addBlog = { id: blogId };
    const shows = showDetail.concat(addBlog);
    setShowDetail(shows);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleOff
    };
  });

  const Blog = ({ blog }) => {
    if (showDetail.filter((x) => x.id === blog.id).length !== 0) {
      return (
        <div className="blog">
          {blog.title} {blog.author}&nbsp;
          <button onClick={() => toggleOff(blog.id)}>hide</button>
          <div>
            {blog.url}
            <br />
            likes&nbsp;{blog.likes}&nbsp;
            <button onClick={() => likeFn(blog)}>like</button>
            <br />
            {blog.user.name}
            {username === blog.user.username && (
              <div>
                <button className="deletebutton" onClick={() => delFn(blog)}>delete</button>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="blog">
          {blog.title} {blog.author}&nbsp;
          <button onClick={() => toggleOn(blog.id)}>view</button>
        </div>
      );
    }
  };
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
});

ShowBlogs.displayName = "ShowBlogs";

export default ShowBlogs;
