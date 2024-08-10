const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

describe("api tests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
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
    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("attempting to create new post with no url gives error", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Harry Potter",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  describe("deletion of a post", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const contents = blogsAtEnd.map((r) => r.title);
      assert(!contents.includes(blogToDelete.title));
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

  after(async () => {
    await mongoose.connection.close();
  });
});
