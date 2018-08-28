(function() {


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
        <div class='piano'></div>
		<div class="icons">
        <p align='right'>
		<a href="https://twitter.com/nicktheandersen" target="_blank" ><img title="Twitter" src="https://socialmediawidgets.files.wordpress.com/2014/03/01_twitter1.png" alt="Twitter" width="35" height="35" scale="0"></a>
		<a href="https://instagram.com/nicktheandersen" target="_blank"><img title="Twitter" src="https://socialmediawidgets.files.wordpress.com/2014/03/10_instagram1.png" alt="Instagram" width="35" height="35" scale="0"></a>
        </p>
		</div>
        </div>
        </div>`,
        methods: {
            toabout: function() {
                this.$emit('toabout')
            }
        }
    })


    app = new Vue({el:"#app"})

})();
