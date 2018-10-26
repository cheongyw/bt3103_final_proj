
const Bar = { template: '<div>TEMP</div>' }
// 2. Define some routes
// Each route should map to a component.
const routes = [
  { path: '/ask', component: Bar },
  { path: '/questions', component: Bar },
  { path: '/reports', component: Bar }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  el: '#app',
  router,
  data: function data() {
    return {
      filter: '',
      sort: '',
      options: [
      { label: 'Default', value: 'none' },
      { label: 'Most Viewed', value: 'views' }],

      players: [
      { name: 'Regression Analysis', sport: 'BT3131', views: 112, color: '#FFC43D' },
      { name: 'Capstone Project', sport: 'BT3101', views: 23121, color: '#43BCCD' },
      { name: 'Big Data Technologies', sport: 'BT4221', views: 231, color: '#F86624' },
      { name: 'Application Development', sport: 'BT3103', views: 443, color: '#06D6A0' },
      { name: 'Analytics for Market Trading', sport: 'BT4013', views: 403, color: '#C8D96F' },
      { name: 'Data Driven Marketing', sport: 'BT4211', views: 8843, color: '#7678ED' }],

      dashboardStats: [
      { title: 'Questions asked in Total', value: '40', color: '#000'},
      { title: 'Questions asked this Sem', value: '21', color: '#000'},
      { title: 'Learner Level', value: 'AVID', color: '#000'}] };
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

    },

    currentRoute () {
    // We will see what `params` is shortly
      return this.$route.path
    }

   } });
