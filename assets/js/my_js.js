(function(){ //start of self-invoking function
  $(function(){ //start of document ready function

    //api credential url
    let myUrl = "http://localhost:1337/Dog/";

    let dogIDInput = $("#dogIDInput");
    let dogBreedInput = $("#dogBreedInput");
    let dogNameInput = $("#dogNameInput");
    let dogAgeInput = $("#dogAgeInput");
    let dogColorInput = $("#dogColorInput");
    let dogPersonalityInput = $("#dogPersonalityInput");
    let dogs;

    //variable to hold current dog we have selected for edit
    let currentDogEdit;

    //variable to hold current dog we have selected for delete
    let currentDogDelete;

    //variable to hold current dog we have selected for add
    let currentDogAdd;

    //disable all input fields at first
    $("#dogDataInput :input").prop("disabled", true);

    //displays(GET AJAX REQUEST) the dogs in the api
    function whoLetTheDogsOut() {
      $("#myTBODY").empty()
      $.get(myUrl,function(data) {
        dogs = data;
        for(let i = 0;i < dogs.length; i++) {
          $("#myTBODY").append(`
              <tr>
                <td>
                <button data-dogid="${dogs[i].id}" type="button" class="btn btn-danger deletebutton">DELETE</button>
                </td>
                <td>
                <button data-dog_update_id="${dogs[i].id}" type="button" class="btn btn-info updatebutton">UPDATE</button>
                </td>
                <td>
                  ${dogs[i].dogBreed}
                </td>
                <td>
                  ${dogs[i].dogName}
                </td>
                <td>
                  ${dogs[i].dogAge}
                </td>
                <td>
                  ${dogs[i].dogColor}
                </td>
                <td>
                  ${dogs[i].dogPersonality}
                </td>
              </tr>
            `)
          }
      })
    }

    //initiliaze dog table from api data
    whoLetTheDogsOut();

    //attach the edit button on the elements after the DOM loads
    $("#myTBODY").on("click", ".updatebutton", function(){

      //store current student in variable for when we submit the form
      //we need this to know what student we are updating
      //variable declared on line 16
      currentDogEdit = $(this).data("dog_update_id");

      $.get(myUrl + currentDogEdit, function(myDog){

        //loop over the student i got back from the api
        $.each(myDog, function(key, val){
            //find the input field that matches the name of the key
            let el = $('[name="'+key+'"]');
            //find the type of field that we selected
            let type = el.attr('type');

            //based on the type choose how we set the value
            switch(type){
                case 'checkbox':
                    el.attr('checked', 'checked');
                    break;
                case 'radio':
                    el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    el.val(val);
            }
        });
      })

      //enable input fields after we fill out the form
      $("#dogDataInput :input").prop("disabled", false);
    })

    //Add dogs to the api
    $("#myTBODY").on("click",".addbutton",function(){
      currentDogAdd = $(this).data("dog_add_id"); //everything you attached to data dogid
      $("#dogDataInput :input").prop("disabled", false);
    })

    //add(POST AJAX REQUEST) a dog to the api
    function addRover() {
      $.post("http://localhost:1337/Dog/" + currentDogAdd, $( "#dogDataInput" ).serialize());

    }

    //Delete dogs from the api
    $("#myTBODY").on("click",".deletebutton",function(){
      currentDogDelete = $(this).data("dogid"); //everything you attached to data dogid
      stopRover();
    })

    //remove(DELETE AJAX REQUEST) a dog from the api
    function stopRover() {
      $.ajax({
        url: "http://localhost:1337/Dog/" + currentDogDelete,
        type: 'DELETE',
        success: function(result) {
          $("#myTBODY").html("");
          whoLetTheDogsOut();
        }
      });
    }

    $("#unlockBtn").click(function() {
      $("#dogDataInput :input").prop("disabled", false);
    })

    //initialize the form submit button
    let submitButton = $("#submitBtn")

    //submitButton to post new data to form
    submitButton.click(function(e){
      e.preventDefault();
      if (document.getElementById('chk_add_dog').checked) {
        $.post("http://localhost:1337/Dog/", $("#dogDataInput").serialize(), function(data){
          //reload student table on success
          whoLetTheDogsOut();

          //disable form fields again
          $("#dogDataInput :input").prop("disabled", true);

          //reset form back to empty fields
          $("#dogDataInput")[0].reset()
        })
        //addRover();
      } else if (document.getElementById('chk_update_dog').checked) {
          $.ajax({
          url: "http://localhost:1337/Dog/" + currentDogEdit,
          data: $("#dogDataInput").serialize(),
          method: "PUT",
          success: function(data){

            //reload student table on success
            whoLetTheDogsOut();

            //disable form fields again
            $("#dogDataInput :input").prop("disabled", true);

            //reset form back to empty fields
            $("#dogDataInput")[0].reset()

          }
        })
      }
    });


  });//end of document ready function
})()//end of self-invoking fuction
