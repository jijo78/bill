var expect = chai.expect;
var assert = chai.assert;

describe("Customer Bill Tests", function() {
  describe("Should initialize a new object.", function() {
    it("Object should exist", function() {

      var bill = new CustomerBill();
      expect(bill).to.be.called
    });
  });
});
