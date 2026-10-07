/**
 * auth.test.js — Integration tests for /api/auth endpoints
 * Run: npm test
 */
const request  = require("supertest");
const mongoose = require("mongoose");
const app      = require("../src/server");

// Use an in-memory DB or a separate test DB
const TEST_DB = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/ai-transporthub-test";

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/auth/register", () => {
  it("should register a new commuter", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "password123", role: "commuter" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.role).toBe("commuter");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("should reject duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User 2", email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should reject short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Short", email: "short@example.com", password: "abc" });

    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should reject wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/auth/me", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    token = res.body.token;
  });

  it("should return current user with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should reject request without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
