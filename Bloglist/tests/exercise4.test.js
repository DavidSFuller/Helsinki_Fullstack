const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../src/app");
const api = supertest(app);
const { initialBlogs, initialUsers } = require("./testData");

beforeEach(async () => {
  await helper.resetDB();
});

describe("Blog list tests step1", () => {
  test("entries are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test(initialBlogs.length + " blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
  });
});

describe("Blog list tests step2", () => {
  test("database has an id property", async () => {
    const blogs = await helper.blogsInDb();
    const id = blogs[0].id;
    //console.log('id is',id)
    expect(id).toBeDefined();
  });
});

describe("Blog list tests step3", () => {
  const blog = {
    title: "new test entry for step3",
    author: "Michael Palin",
    url: "https://reactpatterns.com/",
    likes: 7,
  };
  test("posted entries are saved to the database", async () => {
    const user = await helper.getUser("root");
    const token = await helper.login("root"); // user for insert/update/delete
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
    const NewBlog = blogsAtEnd
      .filter((b) => b.id === response.body.id)
      .map((b) => {
        const { id, ...rest } = b;
        return rest;
      });
    const expected = { ...blog, user: user._id };
    expect(NewBlog[0]).toEqual(expected);
  });
});

describe("Blog list tests step4", () => {
  const blog = {
    title: "no likes test",
    author: "Charles Chaplin",
    url: "https://reactpatterns.com/",
  };

  test("missing likes gets zero value", async () => {
    const token = await helper.login("root"); // user for insert/update/delete
    const response1 = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response2 = await api
      .get(`/api/blogs/${response1.body.id}`)
      .expect(200);

    expect(response2.body.likes).toEqual(0);
  });
});

describe("Blog list tests step5", () => {
  const blog1 = {
    author: "missing title",
    url: "https://reactpatterns.com/",
    likes: 1,
  };

  const blog2 = {
    title: "missing url",
    author: "Michael Cain",
    likes: 2,
  };

  test("missing title test", async () => {
    const token = await helper.login("root"); // user for insert/update/delete
    const response1 = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog1)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(initialBlogs.length);
  });

  test("missing url test", async () => {
    const token = await helper.login("root"); // user for insert/update/delete
    const response2 = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog2)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(initialBlogs.length);
  });
});

describe("Blog list expansions step1", () => {
  test("single delete succeedes with status code 204 if it is valid", async () => {
    const blogsAtStart = await helper.blogUserInDb(); // expanded with user details
    const blogToDelete = blogsAtStart[0]; // delete the first blog
    const token = await helper.login(blogsAtStart[0].user.username); // user for the first row

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  });
});

describe("Blog list expansions step2", () => {
  test("update a single post, one field", async () => {
    const initialBlogs = await helper.blogUserInDb(); // expanded with user details
    const idToUpdate = initialBlogs[0]._id.toString(); // update the first blog
    const blogChange = { author: "updated entry" }; // change just the author
    const updatedBlog = {
      // this is what the blog should look like
      title: initialBlogs[0].title,
      author: blogChange.author,
      url: initialBlogs[0].url,
      likes: initialBlogs[0].likes,
      user: initialBlogs[0].user._id,
    };
    const token = await helper.login(initialBlogs[0].user.username); // user for the first row

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send(blogChange)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
    const NewBlog = blogsAtEnd
      .filter((b) => b.id === idToUpdate)
      .map((b) => {
        const { id, ...rest } = b;
        return rest;
      });
    expect(NewBlog[0]).toEqual(updatedBlog);
  });

  test("update a single post to likes=0 (falsy value)", async () => {
    const initialBlogs = await helper.blogUserInDb();
    const idToUpdate = initialBlogs[0]._id.toString(); // update the first note
    const blogChange = { likes: 0 }; // change just the likes
    const updatedBlog = {
      // this is what the blog should look like
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: blogChange.likes,
      user: initialBlogs[0].user._id,
    };
    const token = await helper.login(initialBlogs[0].user.username); // user for the update

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send(blogChange)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
    const NewBlog = blogsAtEnd
      .filter((b) => b.id === idToUpdate)
      .map((b) => {
        const { id, ...rest } = b;
        return rest;
      });
    expect(NewBlog[0]).toEqual(updatedBlog);
  });

  test("update a single post, all fields", async () => {
    const initialBlogs = await helper.blogUserInDb();
    const idToUpdate = initialBlogs[0]._id.toString(); // update the first blog
    const updatedBlog = {
      title: "updated entry",
      author: "Updated Name",
      url: "https://updatedurl.com/",
      likes: 99,
    };
    const token = await helper.login(initialBlogs[0].user.username); // user for update

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
    const NewBlog = blogsAtEnd
      .filter((b) => b.id === idToUpdate)
      .map((b) => {
        const { id, ...rest } = b;
        return rest;
      });

    const expected = { ...updatedBlog, user: initialBlogs[0].user._id };
    expect(NewBlog).toContainEqual(expected);
  });
});

describe("User Authentication tests", () => {
  test("Login works with valid password", async () => {
    const user = initialUsers[0];
    const loginuser = {
      username: user.username,
      password: user.password,
    };
    const response = await api
      .post("/api/login")
      .send(loginuser)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.token).toBeDefined();
  });

  test("Login fails with invalid password", async () => {
    const user = initialUsers[0];
    const loginuser = {
      username: user.username,
      password: "wrongpassword",
    };
    const response = await api
      .post("/api/login")
      .send(loginuser)
      .expect(401)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toEqual("invalid username or password");
  });

  test("update works for likes update if wrong user", async () => {
    const blogsAtStart = await helper.blogUserInDb();
    const idToUpdate = blogsAtStart[0]._id.toString(); // update the first note
    const blogChange = { likes: 0 }; // change just the likes
    const updatedBlog = { ...blogsAtStart[0], ...blogChange };
    const user = blogsAtStart[0].user;
    const wronguser = initialUsers.filter((u) => u.username !== user.username);
    const token = await helper.login(wronguser[0].username);

    const response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send(blogChange)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);

    const NewBlog = blogsAtEnd
      .filter((b) => b.id === idToUpdate)
      .map((b) => {
        const { id, ...rest } = b;
        return rest;
      });

    expect(NewBlog).toContainEqual(updatedBlog);
  });

  test("update fails if wrong user", async () => {
    const blogsAtStart = await helper.blogUserInDb();
    const idToUpdate = blogsAtStart[0]._id.toString(); // update the first note
    const blogChange = { author: "bad robot" }; // change just the likes
    const user = blogsAtStart[0].user;
    const wronguser = initialUsers.filter((u) => u.username !== user.username);
    const token = await helper.login(wronguser[0].username);

    const response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send(blogChange)
      .expect(401);
    expect(response.body.error).toEqual("user cannot update this row");

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });

  test("delete fails if wrong user", async () => {
    const blogsAtStart = await helper.blogUserInDb();
    const idToDelete = blogsAtStart[0]._id.toString(); // delete the first note
    const user = blogsAtStart[0].user;
    const wronguser = initialUsers.filter((u) => u.username !== user.username);
    const token = await helper.login(wronguser[0].username);

    const response = await api
      .delete(`/api/blogs/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
    expect(response.body.error).toEqual("user cannot delete this row");

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
