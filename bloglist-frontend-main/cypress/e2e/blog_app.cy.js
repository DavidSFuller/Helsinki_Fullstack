describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "david",
      name: "David Fuller",
      password: "wizzard"
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function() {
    cy.contains("Log in to application");
  });

  describe("Login",function() {
    it("fails with wrong credentials", function() {
      cy.get("#username").type("david");
      cy.get("#password").type("allwrong");
      cy.contains("login").click();
      cy.contains("Wrong credentials");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
      cy.get(".error").should("have.css", "border-style", "solid");
    });

    it("succeeds with correct credentials", function() {
      cy.get("#username").type("david");
      cy.get("#password").type("wizzard");
      cy.get("#login-button").click();
      cy.contains("David Fuller logged in");
    });
  });

  describe("When logged in", function() {
    beforeEach(function() {
      cy.login({ username: "david", password: "wizzard" });
    });

    it("A blog can be created", function() {
      cy.contains("create new blog").click();
      cy.get("#title").type("blog entry created by cypress");
      cy.get("#author").type("Author Name");
      cy.get("#url").type("http://blog-address");
      cy.get("#submit-button").click();
      cy.contains("a new blog \"blog entry created by cypress\" by Author Name added");
      cy.contains("view").parent().contains("blog entry created by cypress Author Name");
    });

    describe("And a blog exists", function() {
      beforeEach(function () {
        cy.createBlog({
          title: "A blog entry",
          author: "John Smith",
          url: "Http://any-address"
        });
      });

      it("Details can be viewed and likes incremented", function () {
        cy.get(".blog")
          .contains("A blog entry John Smith")
          .parent()
          .get("#view-button").click();
        cy.contains("likes 0");
        cy.get("#likes-button").click();
        cy.contains("likes 1");
      });

      it("owner can delete a blog", function () {
        cy.get(".blog")
          .contains("A blog entry John Smith")
          .parent()
          .get("#view-button").click();

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .parent()
          .get("#delete-button").click();

        cy.contains("Blog \"A blog entry\" by John Smith removed.");
        cy.should("not.contain", "A blog entry John Smith");
      });

      it("Only owner can see the delete button", function () {
        const user = {
          username: "john",
          name: "John Thomas",
          password: "woopee",
          likes: 1
        };
        cy.request("POST", "http://localhost:3003/api/users/", user);
        cy.visit("http://localhost:3000");

        cy.login({ username: "john", password: "woopee" });

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .get("#view-button").click();

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .should("not.contain", "delete");
      });

      it("blogs ordered by likes", function () {
        cy.createBlog({
          title: "Likes are 1 and do not change",
          author: "Henry Ford",
          url: "Http://ford.co.uk",
          likes: 1
        });

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .find("#view-button").as("viewButton")
          .get("@viewButton").click();

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .find("#likes-button").as("likeButton")
          .get("@likeButton").click();

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .contains("likes 1");

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .find("#likes-button").as("likeButton")
          .get("@likeButton").click();

        cy.get(".blog")
          .contains("A blog entry John Smith")
          .contains("likes 2");

        cy.get(".blog").eq(0).should("contain", "A blog entry John Smith");
        cy.get(".blog").eq(1).should("contain", "Likes are 1 and do not change Henry Ford");
      });
    });
  });
});