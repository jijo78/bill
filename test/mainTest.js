var expect = chai.expect;
var assert = chai.assert;

describe("Customer Bill Tests", function() {
  var bill = new CustomerBill();
  var mock = {
    statement:{
      period:{
        from:'',
        to:''
      }
    },
    package: {
        subscriptions: [{
        type: "tv",
        name: "Variety with Movies HD",
        cost: 50
      }]
    },
    callCharges: {
      calls: [
        {
          called: "07716393769",
          duration: "00:23:03",
          cost: 2.13
        }
      ]
    },
    skyStore: {
      rentals: [
        {
          title: "50 Shades of Grey",
          cost: 4.99
        }
      ],
      buyAndKeep: [
        {
          title: "That's what she said",
          cost: 9.99
        }
      ]
    }
  }
  describe("CustomerBill constructor.", function() {
    it("Object should exist when initialized.", function() {
      var spy = chai.spy(bill);
      expect(spy).to.be.called
    });
  });


  describe("dataLoop.", function() {
    it("should be called with all 3 parameters.", function() {
      var spy = chai.spy.on(bill,'dataLoop');
      var arr,callBackArg,newArr;
       expect(spy).to.have.been.called.with(arr);
    });
  });

  describe("dataSuccess.", function() {
    it("should throw an error if no argument has been passed.", function() {
      expect(function() {
       (bill).dataSuccess();
     }).to.throw(Error);
    });
  });

});
