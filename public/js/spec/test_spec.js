var emailValidator = require("../custom.js");

describe("emailValidator", function() {
 describe("validateEmail()", function() {
   it("should returns a true if the email format is valid or false if it is not", function () {
      expect(emailValidator("mytest@")).toBe(false);
      expect(emailValidator("mytest")).toBe(false);
      expect(emailValidator("mytest@abc")).toBe(false);
      expect(emailValidator("mytest@abc.")).toBe(false);
      expect(emailValidator("mytest@abc.c")).toBe(true);
      expect(emailValidator("mytest@abc.com")).toBe(true);
   });
 });
});