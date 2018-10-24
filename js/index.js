 // Thanks Dev Coffee! :)
// https://www.youtube.com/watch?v=VPUdtEf3oXI

new Vue({
  el: '#app',
  data: function data() {
    return {
      filter: '',
      sort: '',
      options: [
      { label: 'Default', value: 'none' },
      { label: 'Most Viewed', value: 'views' }],

      players: [
      { name: 'Regression Analysis', sport: 'BT3131', views: 112 },
      { name: 'Capstone Project', sport: 'BT3101', views: 23121 },
      { name: 'Big Data Technologies', sport: 'BT4221', views: 231 },
      { name: 'Application Development', sport: 'BT3103', views: 443 },
      { name: 'Analytics for Market Trading', sport: 'BT4013', views: 403 },
      { name: 'Data Driven Marketing', sport: 'BT4211', views: 8843 }] };


  },
  computed: {
    getPlayers: function getPlayers() {var _this = this;

      var players = this.players.filter(function (player) {
        return player.name.toLowerCase().includes(_this.filter.toLowerCase());
      });

      if (this.sort == 'views') {
        return players.sort(function (a, b) {
          return b.views - a.views;
        });
      } else {
        return players;
      }

    } } });
