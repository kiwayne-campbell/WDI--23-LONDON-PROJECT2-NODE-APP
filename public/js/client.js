$(() => {

  let $main = $('main');
  let currentUsername;
  let currentUsergroup;
  let currentUserId;


  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  if(isLoggedIn()) {
    createGroup();
  } else {
    fireworksSplash();
  }

  function createGroup() {
    if(event) event.preventDefault();
    $main.html(`
      <div class="one-third column">&nbsp;</div>
      <div class="one-third column">
      <h2>Create Group</h2>

      <button class="btn btn-primary u-full-width create">Create Group</button>
      <button class="btn btn-primary u-full-width join">Join Group</button>
      <button class="btn btn-primary u-full-width profile">Got No Friends</button>
      </div>
      <div class="one-third column">&nbsp;</div>
      `);$('.create').on( "click", createNewGroup);
      $('.join').on( "click", joinGroup);
      $('.profile').on( "click", showProfile);
    }

    function joinGroup() {
      if(event) event.preventDefault();
      $main.html(`
        <div class="one-third column">&nbsp;</div>
        <div class="one-third column">
        <h2>Join Group</h2>

        <form method="put" action="/login">
        <input class="form-control u-full-width" type="text" name="username" placeholder="Enter group name">
        <button class="btn btn-primary u-full-width profile">submit</button>
        <button class="btn btn-primary u-full-width back">Go Back</button>
        </form>
        </div>
        <div class="one-third column">&nbsp;</div>
        `);
        $('.profile').on('submit', 'form', handleForm);
        $('.back').on( "click", createGroup);
      }

      function createNewGroup() {
        if(event) event.preventDefault();
        let id = localStorage.getItem('userId');
        $main.html(`
          <div class="one-third column">&nbsp;</div>
          <div class="one-third column">
          <h2>Create Group</h2>

          <form method="put" action="/users/${id}" class="new-group">
          <input class="form-control u-full-width" type="text" name="groupname" placeholder="Group name">
          <button class="btn btn-primary u-full-width profile">Submit</button>
          <button class="btn btn-primary u-full-width back">Go Back</button>
          </form>
          </div>
          <div class="one-third column">&nbsp;</div>
        `);
        $('.profile').on('submit', 'form', handleForm);
        $('.back').on( "click", createGroup);
      }


    function fireworksSplash() {
      $main.html(`
        <div class="one-third column">&nbsp;</div>
        <div class="one-third column">
        <h2>Welcome to Londons Burning - fireworks display App!</h2>
        <button class ="login loggedOut u-full-width" href= "#">Login</button>
        <button class ="register loggedOut u-full-width" href= "#">Register</button>
        </div>
        <div class="one-third column">&nbsp;</div>`
      ); $('.login').on( "click", showLoginForm);
      $('.register').on('click', showRegisterForm);
    }

    function showProfile() {
      if(event) event.preventDefault();
      $main.html(`
        <div class="one-third column">&nbsp;</div>
        <div class="one-third column">
        <h2>Welcome</h2>
        <p> Two ways to use this App.
        1. Give your group name to your friends. So they can register
        and join the same group.<br>
        2.Enter the other memebers details yourself, provided you know the address of where they will be travelling from.<br>
        3. Alternatively, plan your own individual route.
        <button class="btn btn-primary u-full-width find">Find Firework displays</button>
        <button class="btn btn-primary u-full-width">See selected</button>
        <button class="btn btn-primary u-full-width create">Create Group</button>
        <button class="btn btn-primary u-full-width join">Join Group</button>
        </div>
        <div class="one-third column">&nbsp;</div>
        `);$('.create').on( "click", createNewGroup);
        $('.join').on( "click", joinGroup);
        $('.find').on( "click", displayMap);
      }

    function showLoginForm() {
      if(event) event.preventDefault();
      $main.html(`
        <div class="one-third column">&nbsp;</div>
        <div class="one-third column">
        <h2>Login</h2>
        <form method="post" action="/login" class="auth">
        <div class="form-group">
        <input class="form-control u-full-width" type="text" name="username" placeholder="Username">
        </div>
        <div class="form-group">
        <input class="form-control u-full-width" type="password" name="password" placeholder="Password">
        </div>
        <button class="btn btn-primary u-full-width">Login</button>
        </form></div>
        <div class="one-third column">&nbsp;</div>
        `);
      }

      function showRegisterForm() {
        if(event) event.preventDefault();
        $main.html(`
          <div class="one-third column">&nbsp;</div>
          <div class="one-third column">
          <h2>Register</h2>
          <form method="post" action="/register" class="auth">
          <div class="form-group">
          <input class="u-full-width" type="text" name="username" placeholder="Username">
          </div>
          <div class="form-group">
          <input id="addressEntry" class="u-full-width" type="text" name="address" placeholder="Address">
          </div>
          <div class="form-group">
          <input class="u-full-width" type="password" name="password" placeholder="Password">
          </div>
          <div class="form-group">
          <input class="u-full-width" type="password" name="passwordConfirmation" placeholder="Password Confirmation">
          </div>
          <button class="btn btn-primary u-full-width">Register</button>
          </form></div>
          <div class="one-third column">&nbsp;</div>
          <div id="map"></div>
          `);
        }


        function displayMap() {
          if(event) event.preventDefault();
          $main.html(`
            <div id="map"></div>
            `);
            initMap();
          }

        $('.logout').on('click', logout);
        function logout() {
          if(event) event.preventDefault();
          localStorage.removeItem('token');
          fireworksSplash();
        }






        //Event listener for whenever you click on a form
        $main.on('submit', 'form.auth', handleForm);
        $main.on('submit', 'form.new-group', handleGroupForm);
        //A function that handles form submissions and goes to the create/join group page if successful
        function handleForm() {
          if(event) event.preventDefault();
          let token = localStorage.getItem('token');
          let $form = $(this);
          let url = $form.attr('action');
          let method = $form.attr('method');
          let data = $form.serialize();
          console.log(url, method, data);
          $.ajax({
            url,
            method,
            data,
            beforeSend: function(jqXHR) {
              if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
            }
          }).done((data) => {
            if(data.token) localStorage.setItem('token', data.token);
            if(data.user._id) localStorage.setItem('userId', data.user._id);
            let currentUsername = data.user.username;
            let currentUsergroup = data.user.groupname;
            createGroup();
          }).fail(fireworksSplash);
        }

        function handleGroupForm() {
          if(event) event.preventDefault();
          let token = localStorage.getItem('token');
          let $form = $(this);
          let url = $form.attr('action');
          let method = $form.attr('method');
          let data = $form.serialize();
          console.log(url, method, data);
          $.ajax({
            url,
            method,
            data,
            beforeSend: function(jqXHR) {
              if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
            }
          }).done((data) => {
            console.log("data:", data);
            showProfile();
          }).fail((err) => {
            console.log(err);
            fireworksSplash();
          });
        }

        let latLng;
        var map;

        function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 51.5287718, lng: -0.2416791},
            zoom: 13,
            mapTypeControl: false
          });

          var addressAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('addressEntry'),{
              componentRestrictions: {
                country: "GB"
              }
            });

            addressAutocomplete.bindTo('bounds', map);
            addressAutocomplete.addListener('place_changed', function() {
              latLng = addressAutocomplete.getPlace().geometry.location.toJSON();
              console.log(latLng);
            });
          }

            // $.ajax({
            //   method: "GET",
            //   url: "/citymapper",
            //   data: {
            //     startcoord: "51.4588305,-0.1272296",
            //     endcoord: "51.5915734,-0.015501"
            //   }
            // }).done((data)=>{
            //   console.log('CITYMAPPERsuccesful');
            //   console.log(data);
            // });
            //find shortest firework travel time

            //We need to get all the fireworks displays and work out the total travel time per display for the total group.

            //Start off with the group of ONE users... Therefore

            $.ajax({
              method: "GET",
              url: "/googleMaps",
              data: {
                origins: "51.4588305,-0.1272296",
                destinations: "51.5915734,-0.015501"
              }
            }).done((data)=>{
              console.log('GOOGLEMAPSsuccesful');
              let tripDistance = data.rows[0].elements[0].distance.value;
              let tripDuration = data.rows[0].elements[0].duration.value;
              console.log(`${tripDistance}m & ${tripDuration}s`);
            });
            //find shortest firework travel time



        });



        // NOT CURRENTLY IN USE ANYWHERE
        //

        //Not in use yet
        // function getFireworksDisplay() {
        //   console.log("H!");
        //   if(event) event.preventDefault();
        //   let token = localStorage.getItem('token');
        //   $.ajax({
        //     url: '/fireworks',
        //     method: 'get',
        //     beforeSend: function(jqXHR) {
        //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
        //     }
        //   })
        //   .done(showDisplays)
        //   .fail(fireworksSplash);
        // }



        // api call to weather function- need to include logo but can't scale yet- '<img src="images/wundergroundLogo_4c_horz2.jpg"/>'

        // function weatherApiCall() {
        //
        //   $.ajax({
        //     url: "http://api.wunderground.com/api/b9fbef563cd64e2c/conditions/q/GB/London.json",
        //     dataType: "json",
        //     success: function(url) {
        //       console.log(url);
        //       var temp_c = url.current_observation.temp_c;
        //       var outlook = url.current_observation.icon;
        //       var precip = url.current_observation.precip_today_metric;
        //       var precipPic = url.current_observation.icon_url;
        //       $("ul.nav > li.weatherApi").html("London | " + temp_c + "ºC" + " | " + precip + "mm " + " | " + outlook + " | " + '<img src="'+ precipPic +' "/>' + " | ");
        //     }
        //   });
        // }
