//import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import ShowBlogs from "./ShowBlogs";
import userEvent from "@testing-library/user-event";

describe("ShowBlogs tests", () => {
  let container;
  const mockLikeHandler = jest.fn();
  const mockDelHandler = jest.fn();

  beforeEach(() => {
    const blogs = [
      {
        title: "title of the blog",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 77777,
        user: { name: "david", usename: "David Fuller", id: "iuh7nmjb76jh" },
        id: "LKJHIULKJIUH87",
      },
    ];

    const username = "david";

    container = render(
      <ShowBlogs
        blogs={blogs}
        likeFn={mockLikeHandler}
        delFn={mockDelHandler}
        username={username}
      />
    ).container;
  });

  test("by default renders title and author but neither url nor likes", () => {
    const div = container.querySelector(".blog");

    expect(div).toHaveTextContent("title of the blog");
    expect(div).toHaveTextContent("Michael Chan");
    expect(div).not.toHaveTextContent("https://reactpatterns.com/");
    expect(div).not.toHaveTextContent("likes");
    expect(div).not.toHaveTextContent("77777");
  });

  test("renders url and likes when view pressed", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);
    const div = container.querySelector(".blog");

    expect(div).toHaveTextContent("title of the blog");
    expect(div).toHaveTextContent("Michael Chan");
    expect(div).toHaveTextContent("https://reactpatterns.com/");
    expect(div).toHaveTextContent("likes");
    expect(div).toHaveTextContent("77777");
  });

  test("check the likes button presses twice", async () => {

    // click the 'view' button
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("likes");

    // we can now press 'like' twice
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockLikeHandler.mock.calls).toHaveLength(2);
  });
});
