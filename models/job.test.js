"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  jobIds,
} = require("./_testCommon");
const { testJobIds } = require("../routes/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*********************** Get all jobs*/
describe("getAll", function () {
  test("get all jobs without any filters", async function () {
    let jobs = await Job.getAll();
    expect(jobs).toEqual([
      {
        id: jobIds[0],
        title: "Accountant",
        salary: 85000,
        equity: null,
        company_handle: "c1",
      },
      {
        id: jobIds[1],
        title: "Legal Assistant",
        salary: 55000,
        equity: null,
        company_handle: "c2",
      },
      {
        id: jobIds[2],
        title: "Python Developer",
        salary: 135000,
        equity: "0.15",
        company_handle: "c2",
      },
      {
        id: jobIds[3],
        title: "QA Analyst",
        salary: 90000,
        equity: "0.05",
        company_handle: "c1",
      },
    ]);
  });

  test("find jobs with minSalary", async function () {
    const result = await Job.getAll({ minSalary: 88000 });
    expect(result).toEqual([
      {
        id: jobIds[2],
        title: "Python Developer",
        salary: 135000,
        equity: "0.15",
        company_handle: "c2",
      },
      {
        id: jobIds[3],
        title: "QA Analyst",
        salary: 90000,
        equity: "0.05",
        company_handle: "c1",
      },
    ]);
  });

  test("find jobs with equity=true", async function () {
    const result = await Job.getAll({ equity: true });

    expect(result).toEqual([
      {
        id: jobIds[2],
        title: "Python Developer",
        salary: 135000,
        equity: "0.15",
        company_handle: "c2",
      },
      {
        id: jobIds[3],
        title: "QA Analyst",
        salary: 90000,
        equity: "0.05",
        company_handle: "c1",
      },
    ]);
  });

  test("find jobs with title", async function () {
    const jobs = await Job.getAll({ title: "analyst" });
    expect(jobs).toEqual([
      {
        id: jobIds[3],
        title: "QA Analyst",
        salary: 90000,
        equity: "0.05",
        company_handle: "c1",
      },
    ]);
  });
});

describe("create", function () {
  let newJob = {
    title: "Operations Analyst",
    salary: 70000,
    equity: null,
    company_handle: "c2",
  };

  test("add new job to db", async function () {
    let result = await Job.create(newJob);
    expect(result).toEqual({
      id: expect.any(Number),
      title: "Operations Analyst",
      salary: 70000,
      equity: null,
      company_handle: "c2",
    });
  });
});

/**************************GET by id */

describe("get by id", function () {
  test("find job using job id", async function () {
    let job = await Job.get(jobIds[0]);
    expect(job).toEqual({
      id: jobIds[0],
      title: "Accountant",
      salary: 85000,
      equity: null,
      company_handle: "c1",
    });
  });
});
