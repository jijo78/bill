 (function (exports) {
   'use strict';

  /**
   * This is the CustomerBill constructor
   * @constructor
   * @this {CustomerBill}
   */

    function CustomerBill() {
      var _this = this;

      //global elements.
      this.billView = document.querySelector( '.bill__view' );
      this.bill = document.querySelector('.bill');
      this.queryResults = document.querySelector( '.output' );
      this.error = document.querySelector('.bill__error-msg');
      this.queryEndPoint = 'https://still-scrubland-9880.herokuapp.com/bill.json';

      //call the addEvent method and check element it is not null or undefined
      if(this.billView){
        this.billView.addEventListener( 'click', this.getQuery.bind(_this) );
      }

    }

    /**
     * getQuery make the ajax call to the feed.
     */
    CustomerBill.prototype.getQuery = function () {
      var _this = this;

        if(_this.bill){
          _this.bill.classList.add('spinner');
        }

        $.ajax( {
            type: 'GET',
            crossDomain: true,
            url: _this.queryEndPoint,
            cache: false,
            dataType: 'json',
            success: function ( data ) {
              _this.dataSuccess(data);
              _this.bill.classList.remove('spinner');
            },
            error: function ( error ) {
              _this.error.innerHTML = error;
            }
        });
    };

    /**
     * dataLoop is an helper function that loop over the data returned.
     * @param  {[type]}   arr          Array
     * @param  {[type]}   callBackArg   String
     * @param  {[type]}   newArr        Array
     */
    CustomerBill.prototype.dataLoop = function ( arr, callBackArg ,newArr ) {
      //safe check to make sure first argument it is an array.
      if(arr){
        arr.forEach( function( callBackArg ) {
          newArr.push(callBackArg);
        });
      }

    };

    /**
     * dataSuccess deal with the data and pass it back to handlebars view.
     * @param  {[type]}   data          Object
     */
    CustomerBill.prototype.dataSuccess = function ( data ) {

      //lets check we have some data back, and the data is the right format before we proceed.
      if(!data && data !=='object'){
        throw new Error('missing data');
      }

      var _this = this,
          call,
          subscription,
          rental,
          buy,
          callTotal = [],
          packagesTotal = [],
          skyStoreTotalRentals = [],
          skyStoreTotalBuyAndKeep = [],
          template,
          context,
          html;

      //lets remove the spinner once we have data succesfully back.
      if(_this.bill){
        _this.bill.classList.remove('spinner');
      }

      //calling the dataLoop helper function to work with our data set
      if(data){
        _this.dataLoop( data.callCharges.calls, call, callTotal);
        _this.dataLoop( data.package.subscriptions, subscription, packagesTotal);
        _this.dataLoop( data.skyStore.rentals, rental, skyStoreTotalRentals);
        _this.dataLoop( data.skyStore.buyAndKeep, buy, skyStoreTotalBuyAndKeep);
      }

      //Handlebars to update the view with the right data.
      template = Handlebars.compile( $( '#output-results' ).html() );
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
      };
      html = template( context );
      _this.queryResults.innerHTML = html;
      _this.error.innerHTML = '';
    };

    //need to export the constructor to be able to unit test it.
    exports.CustomerBill = CustomerBill;
    return new CustomerBill();
} )(this);
