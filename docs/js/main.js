(function() {

    $(() => {
        app = new Vue({el:"#app"})
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
    Vue.component('nta-app', {
        template: `<div>
        <nta-piano v-if="page=='piano'" @toabout="toabout"></nta-piano>
        <nta-aboutme v-if="page=='about'" @topiano="topiano"></nta-aboutme>
        </div>`,
        data: function() {
            return {
                page: "piano"
            }
        },
        methods: {
            toabout: function() {
                this.page = "about"
            },
            topiano: function() {
                this.page = "piano"
            }
        }
    });
    Vue.component('nta-aboutme', {
		template: `<div>
        <br>
        <br>
        <p>Lorem Ipsum</p>
        <br>
        <a class='nav' href="#" v-on:click="topiano()">back</a>
		</div>`,
        methods: {
            topiano: function() {
                this.$emit('topiano')
            }
        }
	})
	
    Vue.component('nta-piano', {
        template: `<div>
        <div class="middlestuff">
        <div class='icons'><a class='nav' href="#" v-on:click="toabout()">about</a></p></div>
        <div class='piano'>
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
            toabout: function() {
                this.$emit('toabout')
            },
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
