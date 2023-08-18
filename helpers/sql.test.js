const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate function", () => {
  test("update user first and last name", () => {
    const result = sqlForPartialUpdate(
      { firstName: "Mary", lastName: "Smith" },
      { firstName: "firstName", lastName: "lastName" }
    );
    expect(result).toEqual({
      setCols: '"firstName"=$1, "lastName"=$2',
      values: ["Mary", "Smith"],
    });
  });
  test("update first name", () => {
    const result = sqlForPartialUpdate(
      { firstName: "Mike" },
      {
        firstname: "firstName",
        lastName: "lastName",
      }
    );
    expect(result).toEqual({
      setCols: '"firstName"=$1',
      values: ["Mike"],
    });
  });
});
