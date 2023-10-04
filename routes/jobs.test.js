"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*************************POST /jobs/ */

describe("POST /jobs", () => {
  const newJob = {
    title: "Product Manager",
    salary: 110000,
    equity: "0.015",
    company_handle: "c1",
  };

  test("admin okay to post jobs", async () => {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Product Manager",
        salary: 110000,
        equity: "0.015",
        company_handle: "c1",
      },
    });
  });

  test("non-admin user posting a job", async () => {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("missing job data", async () => {
    const resp = await request(app)
      .post("/jobs")
      .send({ title: "Marketing Manager" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/*************************GET /jobs/ */

describe("GET /jobs", () => {
  test("get all job", async () => {
    const resp = await request(app).get("/jobs");

    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Legal Assistant",
          salary: 70000,
          equity: "0",
          company_handle: "c2",
        },
        {
          id: expect.any(Number),
          title: "Systems Engineer",
          salary: 110000,
          equity: "0.015",
          company_handle: "c1",
        },
      ],
    });
  });

  test("get jobs with minSalary", async () => {
    const resp = await request(app).get("/jobs/?minSalary=85000");
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Systems Engineer",
          salary: 110000,
          equity: "0.015",
          company_handle: "c1",
        },
      ],
    });
  });

  test("get jobs with equity", async () => {
    const resp = await request(app).get("/jobs/?equity=true");
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Systems Engineer",
          salary: 110000,
          equity: "0.015",
          company_handle: "c1",
        },
      ],
    });
  });

  test("get jobs with equity and title", async () => {
    const resp = await request(app).get(
      "/jobs/?title=engineer&minSalary=100000"
    );
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Systems Engineer",
          salary: 110000,
          equity: "0.015",
          company_handle: "c1",
        },
      ],
    });
  });
});

/*********************PATCH /jobs/:id */
describe("PATCH /:id", () => {
  test("admin is able to update job", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJobIds[0]}`)
      .send({
        title: "Account Executive",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Account Executive",
        salary: 70000,
        equity: "0",
        company_handle: "c2",
      },
    });
  });

  test("missing data ", async () => {
    const resp = await request(app)
      .patch(`/jobs/${testJobIds[0]}`)
      .send({ title: 1500 })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("non-admin user", async () => {
    const resp = await request(app)
      .patch(`/jobs/${testJobIds[0]}`)
      .send({ title: "Account Executive" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("invalid job id", async () => {
    const resp = await request(app)
      .patch(`/jobs/12`)
      .send({ title: "NetSuite System Admin" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

describe("DELETE /jobs/:id", () => {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/jobs/${testJobIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: testJobIds[0] });
  });

  test("doesn't work for non-admin", async () => {
    const resp = await request(app)
      .delete(`/jobs/${testJobIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});
