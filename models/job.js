"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/*query jobs table to get all job. 3 different conditions can be
passed in the query*/

class Job {
  static async getAll({ title, minSalary, equity }) {
    let queryStr = `SELECT id,
                    title,
                    salary,
                    equity,
                    company_handle AS "company_handle"
                    FROM jobs
                    `;

    let queryCondition = [];
    let queryValues = [];

    if (title !== undefined) {
      queryValues.push("%title%");
      queryCondition.push(`title ILIKE $${queryValues.length}`);
    }

    if (minSalary !== undefined) {
      queryValues.push(minSalary);
      queryCondition.push(`salary >= $${queryValues.length}`);
    }

    if (equity === "true") {
      console.log("hello");
      queryCondition.push("equity > 0");
    }

    if (queryCondition.length > 0) {
      queryStr += " WHERE " + queryCondition.join(" AND ");
    }

    queryStr += " ORDER BY title";

    const jobs = await db.query(queryStr, queryValues);

    return jobs.rows;
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO jobs
        (title, salary, equity, company_handle)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, salary, equity, company_handle`,
      [data.title, data.salary, data.equity, data.company_handle]
    );
    let job = result.rows;

    return job;
  }

  static async get(id) {
    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle FROM jobs WHERE id = $1`,
      [id]
    );
    if (!result) throw new NotFoundError(`There is no job with id=${id}`);
    return result.rows[0];
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querSql = `UPDATE jobs
                    SET ${setCols}
                    WHERE id = ${idVarIdx}
                    RETURNING id, title, salary,
                            equity, company_handle AS "companyHandle"`;

    const result = await db.query(querSql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs WHERE id=$1
    RETURNING id`,
      [id]
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`There is no job with id=${id}`);
  }
}

module.exports = Job;
