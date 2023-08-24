"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
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

  //   test("get jobs with minSalary", async () => {
  //     const resp = await request(app).get("/jobs/?minSalary=85000");
  //     expect(resp.body).toEqual({
  //       jobs: [
  //         {
  //           id: expect.any(Number),
  //           title: "Systems Engineer",
  //           salary: 110000,
  //           equity: "0.015",
  //           company_handle: "c1",
  //         },
  //       ],
  //     });
  //   });
});
