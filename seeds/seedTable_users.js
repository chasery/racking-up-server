exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          email: "jim.halpert@gmail.com",
          password: "password",
          name: "Jim",
          created_date: "2020-03-25T12:00:00Z",
        },
        {
          email: "worldsbestboss@aol.com",
          password: "test-password",
          name: "Michael Scott",
          created_date: "2019-07-25T12:00:00Z",
        },
        {
          email: "pambeasley2k@gmail.com",
          password: "this-password",
          name: "",
          created_date: "2019-07-02T12:00:00Z",
        },
        {
          email: "dschrute@hotmail.com",
          password: "assistant-password",
          name: "Dwight",
          created_date: "2018-12-25T12:00:00Z",
        },
        {
          email: "ryanh@oward@gmail.com",
          password: "best-password",
          name: "R Howard",
          created_date: "2018-03-03T12:00:00Z",
        },
      ]);
    });
};
