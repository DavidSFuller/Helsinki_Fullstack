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
          id="title"
          value={newTitle}
          onChange={(event) => setTitle(event.target.value)}
          placeholder='enter blog title'
        />
        <br />
        author:&nbsp;
        <input
          id="author"
          value={newAuthor}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="enter blog author"
        />
        <br />
        url:&nbsp;
        <input
          id="url"
          value={newUrl}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="enter blog url"
        />
        <br />
        <button id="submit-button" type="submit">create</button>
      </form>
    </div>
  );
};

export default NewBlogForm;
