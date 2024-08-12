const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");
let token;
let user;

describe("api tests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);

    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10);
    user = new User({ username: "samwise", passwordHash });
    await user.save();
    const response = await api.post("/api/login").send({
      username: "samwise",
      password: "password",
    });

    token = response.body.token;
  });
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("_id field is renamed to id", async () => {
    const response = await api.get("/api/blogs");
    assert("id" in response.body[0]);
  });

  test("post creates new blog entry", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Harry Potter",
      url: "https://isvoldemortreal.com/",
      likes: 7,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((b) => b.title);
    assert(contents.includes("Test Blog"));
  });

  test("creating new post with no likes defaults to 0", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Harry Potter",
      url: "https://isvoldemortreal.com/",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.find((b) => b.title === "Test Blog");
    assert(contents.likes === 0);
  });

  test("attempting to create new post with no title gives error", async () => {
    const newBlog = {
      author: "Harry Potter",
      url: "https://isvoldemortreal.com/",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test("attempting to create new post with no url gives error", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Harry Potter",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  describe("deletion of a post", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const newBlog = new Blog({
        title: "testing middleware",
        url: "www.bloggy.com",
        likes: 5,
        user: user._id,
      });
      const blogToDelete = await newBlog.save();
      const blogsAtStart = await helper.blogsInDb();

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      console.log(blogsAtStart, blogsAtEnd);
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const contents = blogsAtEnd.map((r) => r.title);
      assert(!contents.includes(blogToDelete.title));
    });

    test("fails with status code 401 if token is invalid", async () => {
      const newBlog = new Blog({
        title: "testing middleware",
        url: "www.bloggy.com",
        likes: 5,
        user: user._id,
      });
      const blogToDelete = await newBlog.save();
      const blogsAtStart = await helper.blogsInDb();

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      const contents = blogsAtEnd.map((r) => r.title);
      assert(contents.includes(blogToDelete.title));
    });

    test("fails with status code 401 if user is invalid", async () => {
      const newBlog = new Blog({
        title: "testing middleware",
        url: "www.bloggy.com",
        likes: 5,
        user: user._id,
      });
      const blogToDelete = await newBlog.save();
      const blogsAtStart = await helper.blogsInDb();

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer sadfasdfasddf`)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      const contents = blogsAtEnd.map((r) => r.title);
      assert(contents.includes(blogToDelete.title));
    });
  });

  describe("update of a post", () => {
    test("can update the likes of a post", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedLikes = {
        likes: blogToUpdate.likes + 1,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)
        .expect(200);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      const contents = blogsAtEnd[0];
      assert(contents.likes === blogToUpdate.likes + 1);
    });
  });

  describe("adding users", () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
    });
    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "samwise",
        name: "Sam",
        password: "password",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Superuser",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
    test("creation fails with proper statuscode and message if username is too short", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "hi",
        name: "Superuser",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes(
          "is shorter than the minimum allowed length (3)"
        )
      );

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
    test("creation fails with proper statuscode and message if password is too short", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "hi",
        name: "Superuser",
        password: "12",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes(
          "password must be greater than 3 characters long."
        )
      );

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
