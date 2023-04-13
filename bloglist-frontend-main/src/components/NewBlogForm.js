import { useState } from "react";

// ***************************************
const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setTitle] = useState("");
  const [newAuthor, setAuthor] = useState("");
  const [newUrl, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:&nbsp;
        <input
          value={newTitle}
          onChange={(event) => setTitle(event.target.value)}
        />
        <br />
        author:&nbsp;
        <input
          value={newAuthor}
          onChange={(event) => setAuthor(event.target.value)}
        />
        <br />
        url:&nbsp;
        <input
          value={newUrl}
          onChange={(event) => setUrl(event.target.value)}
        />
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default NewBlogForm;
