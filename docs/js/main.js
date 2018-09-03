(function() {

    $(() => {
        Vue.use(VueRouter);
        const router = new VueRouter({
           routes : [
               { path: '/', component: Home },
               { path: '/about', component: About }
           ]
        });
        app = new Vue({router: router,
			el:"#app"})
    });
    Array.prototype.shuffle = function() {
      var i = this.length, j, temp;
      if ( i == 0 ) return this;
      while ( --i ) {
         j = Math.floor( Math.random() * ( i + 1 ) );
         temp = this[i];
         this[i] = this[j];
         this[j] = temp;
      }
      return this;
    }


    Vue.component('nta-header',{
        template:`
        <div class='title'>
        nick andersen
        </div>
        `
    });
    var About = Vue.component('nta-aboutme', {
		template: `<div>
        <br>
        <br>
        <p>Nick Andersen is a radio producer living in Cambridge, MA.</p>
        <br>
        <router-link class='nav' to="/">back</router-link>
		</div>`
	})
	
    var Home = Vue.component('nta-home', {
        template: `<div>
        <div class="middlestuff">
        <div class='icons'><router-link class='nav' to="/about">about</router-link></p></div>
        <div class='home'>
        <div v-for="i in images"><img class='instaimg' v-bind:src="i"></div>
        </div>
		<div class="icons">
        <p align='right'>
		<a href="https://twitter.com/nicktheandersen" target="_blank" ><img class="theicons" title="Twitter" src="https://socialmediawidgets.files.wordpress.com/2014/03/01_twitter1.png" alt="Twitter" width="35" height="35" scale="0"></a>
		<a href="https://instagram.com/nicktheandersen" target="_blank"><img class="theicons" title="Twitter" src="https://socialmediawidgets.files.wordpress.com/2014/03/10_instagram1.png" alt="Instagram" width="35" height="35" scale="0"></a>
        </p>
		</div>
        </div>
        </div>`,
        data: function() {
            return {
                images: [],
                desired_images: 10
            }
        },
        methods: {
            update_images: function() {
                jQuery.ajax('https://instagram.com/nicktheandersen').done((response) => {
                    response = response.replace(/\n/g,' ');
                    // Fingers crossed that instagram doesn't have some XSS bullshit in here...
                    var match = response.match(/window._sharedData = (.*?);<\/script>/);
                    var data = JSON.parse(match[1]);
                    // Oh yeah, there's *no* way this will ever break
                    // I apologize
                    var edges = data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
					edges.shuffle();
					edges.forEach( (edge) => {
                        if (this.images.length < this.desired_images ) {
                            if (edge.node.dimensions.height > 1070 && edge.node.dimensions.height < 1090)
                            this.images.push(edge.node.display_url);
                        }
                    });
                })
            },
            backfill_images: function() {
                var default_nums = [];
                for (var i=0; i<this.desired_images; i++)
                    default_nums.push(i);
                default_nums.shuffle();

                default_nums.forEach( (i) => {
                    if (this.images.length < this.desired_images) {
                        this.images.push("/img/fallback_" + i + ".img");
                    }
                });

            }
        },
        mounted: function() {
            this.update_images();

			// After 3 seconds, backfill missing images
            // This is in case insta is down, or, more likely, have changed
            // the format of their page such that the parsing of urls breaks.
            setTimeout(function() {
                    this.backfill_images();
            }.bind(this), 3000);
            //this.update_images();
        }
    })



})();
