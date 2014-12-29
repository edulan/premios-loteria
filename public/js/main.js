/* globals Marionette, Backbone */
(function(root) {
  'use strict';

  var MyApp = new Marionette.Application();

  MyApp.Ticket = Backbone.Model.extend({
    url: 'api/LoteriaNinoPremiados',

    defaults: {
        number: '00000'
    },

    parse: function(response) {
      var str, attrs;

      str = response.replace(/^.*=(\{.*\})$/, '$1');

      try {
        attrs = JSON.parse(str);
      } catch (e) {
        return {};
      }

      return {
        ts: attrs['timestamp'],
        prize: attrs['premio'],
        status: attrs['status'],
        error: attrs['error']
      };
    }
  });

  MyApp.Tickets = Backbone.Collection.extend({
    model: MyApp.Ticket,

    comparator: 'number'
  });

  MyApp.TicketItemView = Marionette.ItemView.extend({
      template: '#ticket-item-template',

      events: {
        'click .btn-close': 'onClose'
      },

      modelEvents: {
        'sync': 'onSync'
      },

      onSync: function(model) {
        var status, statusClass;

        status = model.get('status');

        switch(status) {
          case 0:
            statusClass = 'ticket-pending';
            break;
        }

        this.$el.addClass(statusClass);
      },

      check: function() {
        this.model.fetch({
          dataType: 'script',
          data: {
            n: this.model.get('number')
          }
        });
      },

      onShow: function() {
        this.check();
      },

      onClose: function(event) {
        this.model.destroy();
      }
  });

  MyApp.TicketsView = Marionette.CompositeView.extend({
      template: '#tickets-template',

      childView: MyApp.TicketItemView,
      childViewContainer: '#tickets',

      events: {
        'submit form': 'onSubmit',
        'keydown #ticket-number': 'onKeyDown'
      },

      onSubmit: function(event) {
        var attrs = this.$("form").serializeObject();

        MyApp.tickets.add(attrs);

        this.$("form")[0].reset();

        event.preventDefault();
      },

      onKeyDown: function(event) {
        if (event.keyCode !== 8 &&
            event.keyCode !== 13 &&
            event.keyCode !== 0 && (event.keyCode < 48 || event.keyCode > 57)) {
          return false;
        }
      }
  });

  MyApp.addInitializer(function() {
      var view, collection;

      MyApp.addRegions({
          mainRegion: "#main-container"
      });

      MyApp.tickets = collection = new MyApp.Tickets();
      view = new MyApp.TicketsView({
        collection: collection
      });

      MyApp.mainRegion.show(view);
  });

  root.MyApp = MyApp;
})(window);
