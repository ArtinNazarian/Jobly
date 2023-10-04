const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");

const jobNewSchema = require("../schemas/jobsNew.json");
const jobsUpdateSchema = require("../schemas/jobsUpdate.json");
const Job = require("../models/job");

const router = new express.Router();

//Get all jobs. Jobs can only be searched using title, equity and minSalary
//Example job/?minSalary=85000

router.get("/", async function (req, res, next) {
  try {
    const filters = req.query;
    if (filters.minSalary !== undefined) filters.minSalary = +filters.minSalary;
    filters.equity = filters.equity === "true";
    const jobs = await Job.getAll(filters);
    return res.json({ jobs });
  } catch (e) {
    return next(e);
  }
});

//create a new job. Input should be {title, salary, equity, company_handle}

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

//Get a specific job information using job id /jobs/<job id>

router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (e) {
    return next(e);
  }
});

/*Update job listing
example input --> {"title":"Legal Assistant", "salary": "70000"}
output {
	"job": {
		"id": 205,
		"title": "Legal Assistant",
		"salary": 70000,
		"equity": "0",
		"companyHandle": "watson-davis"
	}
}
*/
router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobsUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const job = await Job.update(req.params.id, req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

//Delete a job using job id.

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
