(function () {
  /**
   * This is the CustomerBill constructor
   * @constructor
   * @this {CustomerBill}
   */

   'use strict';

    function CustomerBill() {
      var _this = this;

      //global elements.
      this.billView = document.querySelector( '.bill__view' );
      this.bill = document.querySelector('.bill');
      this.queryResults = document.querySelector( '.output' );
      this.error = document.querySelector('.bill__error-msg');
      this.errorMsg = 'Sorry we are experiencing some techinical problem. Please try later';

      //call the addEvent method
      this.addEvent( this.billView, 'click', this.getQuery.bind(_this) );

    }

    /**
     * getQuery make the ajax call to the feed.
     */
    CustomerBill.prototype.getQuery = function () {
        var _this = this,
            queryEndPoint = 'https://still-scrubland-9880.herokuapp.com/bill.json';

        _this.queryResults.classList.add('spinner');

        //Wrapping in a setTimeout function so we can clear if we have a type delay
        //and not have multiple search going on.
          $.ajax( {
              type: 'GET',
              crossDomain: true,
              url: queryEndPoint,
              cache: false,
              dataType: 'json',
              success: function ( data ) {
                dataSuccess(data);
                _this.queryResults.classList.remove('spinner');
              },
              error: function ( error ) {
                dataError( error );
              }
          });

          function dataSuccess(data){

            if( !data ){
              return;
            }

            _this.queryResults.classList.remove('spinner');

            var callTotal = [],
                packagesTotal = [],
                skyStoreTotalRentals = [],
                skyStoreTotalBuyAndKeep = [],
                template = Handlebars.compile( $( '#output-results' ).html() ),
                context = {
                  'calls' : callTotal,
                  'callsTotal' : data.callCharges.total,
                  'packages' : packagesTotal,
                  'packagesTotal': data.package.total,
                  'storeRentals' : skyStoreTotalRentals,
                  'storeBuyAndKeep' : skyStoreTotalBuyAndKeep,
                  'storeTotal' : data.skyStore.total,
                  'billFrom' : data.statement.period.from,
                  'billTo' : data.statement.period.to,
                  'billDue' : data.statement.due,
                  'total' : data.total
                },
                html;

            data.callCharges.calls.forEach( function( call ) {
              callTotal.push(call);
            });

            data.package.subscriptions.forEach( function( subscription ) {
              packagesTotal.push(subscription);
            });

            data.skyStore.rentals.forEach( function( rental ) {
              skyStoreTotalRentals.push(rental);
            });

            data.skyStore.buyAndKeep.forEach( function( buy ) {
              skyStoreTotalBuyAndKeep.push(buy);
            });

            //Handlebars to update the view

            html = template( context );
            _this.queryResults.innerHTML = html;
            _this.error.innerHTML = '';
          }

        function dataError( error ){
          _this.queryResults.classList.remove('bill--spinner');
          _this.error.innerHTML = _this.errorMsg;
        }
    };

    /**
     * addEvent is an helper function that addEventListener to an element
     * @param  {[array]}   arr          Array
     * @param  {[type]}   callBackArg   String
     * @param  {[array]} newArr        Array
     */
    CustomerBill.prototype.data = function ( arr, callBackArg ,newArr ) {
      arr.forEach( function( callBackArg ) {
        newArr.push(callBackArg);
      });
    };

    /**
     * addEvent is an helper function that addEventListener to an element
     * @param  {[type]}   el          HTMLelement
     * @param  {[type]}   typeOfevent Event
     * @param  {Function} fn          Function
     */
    CustomerBill.prototype.addEvent = function ( el, typeOfevent ,fn ) {
      el.addEventListener( typeOfevent, function ( event ) {
        event.preventDefault();
        event.stopPropagation();
        fn();
      });
    };

    return new CustomerBill();
} )();
