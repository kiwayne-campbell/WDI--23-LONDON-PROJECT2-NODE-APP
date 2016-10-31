$(() => {

  let $main = $('main');

  //USERS STUFF
  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $('.usersIndex').on('click', getUsers);
  $('.logout').on('click', logout);
  $main.on('click', 'button.delete', deleteUser);
  $main.on('click', 'button.edit', getUser);
  $main.on('submit', 'form', handleForm);
  weatherApiCall();


  //PLACES STUFF
  // $main.on('click', 'button.deletePlace', deletePlace);
  // $main.on('click', 'button.editPlace', getPlace);
  // $('.places').on('click', getPlaces);
  // $('.place').on('click', showPlaceForm);


  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }



  if(isLoggedIn()) {
    console.log('Logged In Is: ',isLoggedIn());
    getFireworksDisplay();
  } else {
    console.log('Logged In Is: ',isLoggedIn());
    fireworksSplash();
  }


// this is main intro page- direct users to either login or register

  function fireworksSplash() {
    $main.html(`
      <h2>Welcome to Londons Burning - firworks display App!</h2>
      <button><a class="login loggedOut" href="#">Login</a></button>
      <button><a class="register loggedOut" href="#">Register</a></button>
      <img src="images/fDisaply.jpg">`
    ); $('.login').on( "click", showLoginForm);
    $('.register').on('click', showRegisterForm);
}



  function showRegisterForm() {
    if(event) event.preventDefault();
    $main.html(`
      <h2>Register</h2>
      <form method="post" action="/register">
      <div class="form-group">
      <input class="form-control" name="username" placeholder="Username">
      </div>
      <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" name="postcode" placeholder="Postcode">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">
      </div>
      <button class="btn btn-primary">Register</button>
      </form>
      `);
    }

    function showLoginForm() {
      if(event) event.preventDefault();
      $main.html(`
        <h2>Login</h2>
        <form method="post" action="/login">
        <div class="form-group">
        <input class="form-control" name="email" placeholder="Email">
        </div>
        <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Password">
        </div>
        <button class="btn btn-primary">Login</button>
        </form>
        `);
      }

      function showUsers(users) {
        let $row = $('<div class="row"></div>');
        users.forEach((user) => {
          $row.append(`
            <div class="col-md-4">
            <div class="card">
            <div class="card-block">
            <h4 class="card-title">${user.username}</h4>
            </div>
            </div>
            <button class="btn btn-danger delete" data-id="${user._id}">Delete</button>
            </div>
            `);
          });

          $main.html($row);
        }

          function getUsers() {
            if(event) event.preventDefault();

            let token = localStorage.getItem('token');
            $.ajax({
              url: '/users',
              method: "GET",
              beforeSend: function(jqXHR) {
                if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
              }
            })
            .done(showUsers)
            .fail(showLoginForm);
          }

          function handleForm() {
            if(event) event.preventDefault();
            let token = localStorage.getItem('token');
            let $form = $(this);
            console.log(token);
            let url = $form.attr('action');
            let method = $form.attr('method');
            let data = $form.serialize();


            $.ajax({
              url,
              method,
              data,
              beforeSend: function(jqXHR) {
                if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
              }
            }).done((data) => {
              console.log(data);
              if(data.token) localStorage.setItem('token', data.token);
              getPlaces();
            }).fail(showLoginForm);
          }

          function deleteUser() {
            let id = $(this).data('id');
            let token = localStorage.getItem('token');

            $.ajax({
              url: `/users/${id}`,
              method: "DELETE",
              beforeSend: function(jqXHR) {
                if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
              }
            })
            .done(getUsers)
            .fail(showLoginForm);
          }

          function getUser() {
            let id = $(this).data('id');
            let token = localStorage.getItem('token');

            $.ajax({
              url: `/users/${id}`,
              method: "GET",
              beforeSend: function(jqXHR) {
                if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
              }
            })
            .done(showEditForm)
            .fail(showLoginForm);
          }

          function logout() {
            if(event) event.preventDefault();
            localStorage.removeItem('token');
            showLoginForm();
          }

          ///////////////////////////////fireworks STUFF STARTS HERE////////////////////////////////

          function getFireworksDisplay() {
            console.log("H!");
            if(event) event.preventDefault();
            let token = localStorage.getItem('token');
            $.ajax({
              url: '/fireworks',
              method: 'get',
              beforeSend: function(jqXHR) {
                if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
              }
            })
            .done(showPlaces)
            .fail(showLoginForm);
          }

          function showPlaces(places) {
            console.log("show", places);
            let $row = $('<div class="row"></div>');
            places.forEach((place) => {
              $row.append(`
                <div class="col-md-4">
                <div class="card">
                <div class="card-block">
                <h4 class="card-title">${place.name}</h4>
                <h4 class="card-title">${place.category}</h4>
                </div>
                </div>
                <button class="btn btn-danger delete" data-id="${place._id}">Delete</button>
                <button class="btn btn-primary edit" data-id="${place._id}">Edit</button>
                </div>
                `);
              });

              $main.html($row);
            }
            function showPlaceForm() {
              if(event) event.preventDefault();
              $main.html(`
                <h2>Add Members</h2>
                <form method="post" action="/members">
                <div class="form-group">
                <input class="form-control" name="name" placeholder="Name of member">
                </div>
                <div class="form-group">
                <input class="form-control" name="category" placeholder="Postcode">
                </div>
                <div class="form-group">
                <input class="form-control" type="number" name="lat" placeholder="Lattitude">
                </div>
                <div class="form-group">
                <input class="form-control" type="number" name="lng" placeholder="Longitude">
                </div>
                <button class="btn btn-primary">Create</button>
                </form>
                `);
              }
        });


// api call to weather function- need to include logo but can't scale yet- '<img src="images/wundergroundLogo_4c_horz2.jpg"/>'

      function weatherApiCall() {

        $.ajax({
          url: "http://api.wunderground.com/api/b9fbef563cd64e2c/conditions/q/GB/London.json",
          dataType: "json",
          success: function(url) {
            console.log(url);
            var temp_c = url.current_observation.temp_c;
            var outlook = url.current_observation.icon;
            var precip = url.current_observation.precip_today_metric;
            var precipPic = url.current_observation.icon_url;
            $("ul.nav > li.weatherApi").html("London | " + temp_c + "ºC" + " | " + precip + "mm " + " | " + outlook + " | " + '<img src="'+ precipPic +' "/>' + " | ");
          }
        });
      }
