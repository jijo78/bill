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

        _this.bill.classList.add('spinner');

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
                _this.bill.classList.remove('spinner');
              },
              error: function ( error ) {
                dataError( error );
              }
          });

          function dataSuccess(data){

            if( !data ){
              return;
            }

            _this.bill.classList.remove('spinner');

            var call,
                subscription,
                rental,
                buy,
                callTotal = [],
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

            //calling the dataLoop helper function to work with ou
            _this.dataLoop( data.callCharges.calls, call, callTotal);
            _this.dataLoop( data.package.subscriptions, subscription, packagesTotal);
            _this.dataLoop( data.skyStore.rentals, rental, skyStoreTotalRentals);
            _this.dataLoop( data.skyStore.buyAndKeep, buy, skyStoreTotalBuyAndKeep);

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
     * dataLoop is an helper function that loop over the data returned.
     * @param  {[type]}   arr          Array
     * @param  {[type]}   callBackArg   String
     * @param  {[type]}   newArr        Array
     */
    CustomerBill.prototype.dataLoop = function ( arr, callBackArg ,newArr ) {
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
