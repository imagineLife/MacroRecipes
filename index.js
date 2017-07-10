const API_URL = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?limitLicense=false&number=30&tags=`
var el, newPoint, newPlace, offset;

function doEverything(){
  function displayAPISearchData(data){
      let recipesVar = data.recipes;
      let APIResults = "";
      
      for(i=0; i<recipesVar.length; i++){
          const rowBeginning = `<div class="row">`;
          const rowEnding = `</div>`;
          let boxItem = `<div class="box col-4">
                  <a href="${recipesVar[i].sourceUrl}" target="_blank" class="tooltip" title="Ready in ${recipesVar[i].readyInMinutes} Minutes">
                    <img src="${recipesVar[i].image}" alt="${recipesVar[i].title}">  
                    <div class="boxDescription">
                      <h3>${recipesVar[i].title}</h3>
                      <p>From ${recipesVar[i].sourceName}</p>
                    </div>
                  </a>
                </div>`;

          if(i == 0){
            APIResults = rowBeginning + boxItem;
          }else if(i % 3 == 2){
              APIResults += boxItem + rowEnding + rowBeginning;
          }else{
            APIResults += boxItem;
          }
      }
          $('.jq-results')
            .html(APIResults);
  }

  function getResFromAPI(searchVal, callback) {
    const infoSettings = {
      url: API_URL+`${searchVal}`, // The URL to the API. You can get this in the API page of the API you intend to consume   
      dataType: 'json',
      success: callback,
      error: function(err) { alert(err); },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-Mashape-Authorization", "Dw5Du2x9f1mshumfYcTmv8RduW9Op1On2QIjsnwkVvyQwCuMSb");
      }
    };
    $.ajax(infoSettings);
  }

  // function getInputVals(){
    let arrInputVals = [];

    $('button')
      .on('click', function(ev){
        ev.preventDefault();

        //loop through form inputs, check for input values
        $(".jq-form input[type=text]").each(function() {

          //if no input value, skip the input
          if( this.value == '') {
          }else{
          //if input HAS value, add input value to an object
            let objInputVal = {};
            let inputKey = this.name;
            let inputVal = this.value;
            objInputVal[inputKey] = inputVal;
            arrInputVals.push(objInputVal);
          }
        });

        // console.log(arrInputVals);


        // //deselct input, clear input value
        // $(this)
        //   .siblings('.userInput')
        //   .trigger('blur');
        // $(this)
        //   .siblings('button')
        //   .trigger('blur');
        // $('.jq-results')
        //   .html('');


          // getResFromAPI(arrInputVals, displayAPISearchData);
      });

    //update the text of the switch based on the color of the switch
    function setInnerText(prevColor, macroName){
      if(prevColor == "rgb(42, 185, 52)"){
        $('.jq-form')
        .children('#macroWrapper')
        .children('.switch')
        .children('.slider')
        .children('#'+macroName)
        .html('Max');
      }else{
        $('.jq-form')
        .children('#macroWrapper')
        .children('.switch')
        .children('.slider')
        .children('#'+macroName)
        .html('Min');
      }
    }

    // get the background-color of the toggle switch
      $('.jq-form')
      .children('#macroWrapper')
      .children('.switch')
      .children('#togBtn')
      .on( 'change', function(){
        let theColor = $(this)
          .siblings('.slider')
          .css("background-color");

        //get className of the element, matching the macroLabel of the current switch
        let curMacro = $(this)
          .siblings('.slider')
          .children('span')
          .attr('id')
        setInnerText(theColor,curMacro);
      });

  // }

}
$(doEverything);