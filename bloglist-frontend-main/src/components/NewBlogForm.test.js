//import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import NewBlogForm from "./NewBlogForm";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  cleanup();
});

describe("test NewBlogtest", () => {

  test("title, author, url passed to event handler", async () => {
    const mockcreateBlog = jest.fn();
    const user = userEvent.setup();

    render(<NewBlogForm createBlog={mockcreateBlog} />);

    const titleInput = screen.getByPlaceholderText("enter blog title");
    const authorInput = screen.getByPlaceholderText("enter blog author");
    const urlInput = screen.getByPlaceholderText("enter blog url");
    const createButton = screen.getByText("create");

    await userEvent.type(titleInput, "new blog");
    await userEvent.type(authorInput, "new author");
    await userEvent.type(urlInput, "new url");
    //screen.debug();
    await user.click(createButton);
    //screen.debug();
    //console.log(mockcreateBlog.mock.calls);

    expect(mockcreateBlog.mock.calls).toHaveLength(1);
    //screen.debug(mockcreateBlog.mock.calls[0][0].authorInput);
    expect(mockcreateBlog.mock.calls[0][0].title).toBe("new blog");
    expect(mockcreateBlog.mock.calls[0][0].author).toBe("new author");
    expect(mockcreateBlog.mock.calls[0][0].url).toBe("new url");

  });
});