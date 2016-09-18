var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();


describe("Customer Bill Tests", function() {
  var bill = new CustomerBill(),
      data = {
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
          ]
        }
      };

    describe("CustomerBill constructor.", function() {
      it("Object should exist when initialized.", function() {
        var spy = sinon.spy(window, 'CustomerBill');
        var bill = new CustomerBill();

        expect(spy.called).to.be.equal(true);
      });
    });

    describe('getQuery method.', function() {
      //no to make a real call, fake server
      //create a response to work with.
        beforeEach(function() {
            this.xhr = sinon.useFakeXMLHttpRequest();

            this.requests = [];
            this.xhr.onCreate = function(xhr) {
                this.requests.push(xhr);
            }.bind(this);
        });

        afterEach(function() {
            this.xhr.restore();
        });

        it('should return a successful response on a 200 status code.', function(done) {
          //Parse the response to json object first.
          var dataJson = JSON.stringify(data);

          bill.getQuery(function(result) {
              result.should.deep.equal(data);
              done();
          });

          this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
        });

        it('should not return data on a 400 Bad Request.', function(done) {
          bill.getQuery(function(result) {
              result.should.not.to.be.deep.equal(data);
              done();
          });

          this.requests[0].respond(400);
        });

        it('should return an error on a 500 Internal Server Error.', function(done) {
            bill.getQuery(function(err) {
                err.should.exist;
                done();
            });

            this.requests[0].respond(500);
        });

      });

      describe('dataLoop method.', function() {
        it('should throw an error if called with no arguments.', function(done) {
          var spy = chai.spy(bill, 'dataLoop');

          expect(spy).to.throw(Error);
          done();
        });

        it('should be called with right arguments.', function(done) {
          var spy = sinon.spy(bill, 'dataLoop'),
              arr = [],
              el = "";
          spy(arr,el,arr);

          spy.firstCall.args;
          done();
        });
      });
  });
