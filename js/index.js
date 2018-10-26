
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

var db = firebase.initializeApp({
        databaseURL: 'https://wala-9b4ce.firebaseio.com/'
      }).database()

var chartsRef = db.ref('charts')


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
      { name: 'Regression Analysis', sport: 'BT3131', views: 112, color: '#FFC43D', url: '/regression' },
      { name: 'Capstone Project', sport: 'BT3101', views: 23121, color: '#43BCCD', url: '/regression'  },
      { name: 'Big Data Technologies', sport: 'BT4221', views: 231, color: '#F86624', url: '/bigdata'  },
      { name: 'Application Development', sport: 'BT3103', views: 443, color: '#06D6A0', url: '/regression' },
      { name: 'Analytics for Market Trading', sport: 'BT4013', views: 403, color: '#C8D96F', url: '/analytics' },
      { name: 'Data Driven Marketing', sport: 'BT4211', views: 8843, color: '#7678ED', url:'/marketing' }],

      chartData: {
        columns: ['week', 'location', 'count'],
        rows: [
          { 'week': 'Week 1', 'location': 'Year 1 Sem 1', 'count': 1 },
          { 'week': 'Week 2', 'location': 'Year 1 Sem 1', 'count': 4 },
          { 'week': 'Week 3', 'location': 'Year 1 Sem 1', 'count': 8 },
          { 'week': 'Week 4', 'location': 'Year 1 Sem 2', 'count': 2 },
          { 'week': 'Week 5', 'location': 'Year 1 Sem 2', 'count': 1 },
          { 'week': 'Week 3', 'location': 'Year 2 Sem 1', 'count': 3 },
          { 'week': 'Week 2', 'location': 'Year 2 Sem 1', 'count': 8 },
          { 'week': 'Week 4', 'location': 'Year 2 Sem 2', 'count': 7 },
          { 'week': 'Week 9', 'location': 'Year 2 Sem 2', 'count': 3 },
          { 'week': 'Week 13', 'location': 'Year 3 Sem 1', 'count': 3 },
          { 'week': 'Week 13', 'location': 'Year 3 Sem 1', 'count': 3 },
          { 'week': 'Week 12', 'location': 'Year 3 Sem 2', 'count': 3 },
          { 'week': 'Week 13', 'location': 'Year 3 Sem 2', 'count': 5 }
        ]
      },

      tableData: [{
        date: '2018-05-03',
        module: 'BT3102',
        question: 'How do I make sense of the regression line?',
        comments: '5'
      }, {
        date: '2018-05-02',
        module: 'BT3101',
        question: 'What are some data visualisations for showing multi-dimenstional data?',
        comments: '4'
      }, {
        date: '2018-04-04',
        module: 'CS2010',
        question: 'Why is it better to use BFS than DFS in example 3?',
        comments: '9'
      }, {
        date: '2018-04-08',
        module: 'CS1020',
        question: 'How do I use recursion to do depth first search?',
        comments: '2'
      }],

      localLineData: [["Sun", 32], ["Mon", 46], ["Tue", 28]],

      dashboardStats: [
      { title: 'Questions asked in Total', value: '4', color: '#000'},
      { title: 'Questions asked this Sem', value: '2', color: '#000'},
      { title: 'Asker Level', value: 'Novice', color: '#000'}] };
  },
  firebase: {
    charts: {
        source: db.ref('charts'),
      // optionally bind as an object
        asObject: true,
    }},
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
