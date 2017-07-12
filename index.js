const API_URL = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByNutrients?number=18&offset=0&random=false`
var el, newPoint, newPlace, offset;
let arrInputVals = [];

function doEverything(){
  
  function displayAPISearchData(data){
      let recipesVar = data;
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

  };

  function getResFromAPI(searchVal, callback) {
    let searchParams = '';
    let searchSnippet = '';
    /*
      -Loop through the array of objects containing search parameters
      -build string-snippets to add to the API url
    */
    for (i = 0; i < searchVal.length; i++){
      let resObj = searchVal[i];
      let firstItem = Object.keys(resObj)[0];
      //if the input is not the keyword input
      if (firstItem != 'includeIngredients'){
        let itemName = Object.keys(resObj)[1];
        let itemVal = resObj[Object.keys(resObj)[1]];
        let minMaxVal = resObj.minMax;
        searchSnippet = '&' + minMaxVal + itemName + '=' + itemVal;
      }else{
      //if the input is the keyword input
        let itemName = Object.keys(resObj)[0];
        let itemVal = resObj[Object.keys(resObj)[0]];        
        searchSnippet = '&' + itemName + '=' + itemVal;
      }
      searchParams += searchSnippet;
    }

    //Build & send the ajax object that requests data from the API
    const infoSettings = {
      url: API_URL+`${searchParams}`,   
      dataType: 'json',
      success: callback,
      error: function(err) { alert(err); },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-Mashape-Authorization", "Dw5Du2x9f1mshumfYcTmv8RduW9Op1On2QIjsnwkVvyQwCuMSb");
      }
    };

    // console.log(infoSettings);
    $.ajax(infoSettings);
  };

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

  //When the search button is selected
  $('.search')
    .on('click', function(ev){
    ev.preventDefault();
    arrInputVals = [];

    //loop through form inputs, check for input values
    $(".jq-form input[type=text]").each(function() {

      //if no input value, skip the input
      if( this.value == '') {
      }else{
      //if input HAS value, add input values to an object
        let objInputVal = {};
        let inputKey = this.name;
        let inputVal = this.value;

        if(this.name != 'includeIngredients'){
          let minMaxVal = $(this)
          .siblings('.switch')
          .children('.slider')
          .children('.off')
          .html();

          objInputVal['minMax'] = minMaxVal.toLowerCase();
        }
        
        objInputVal[inputKey] = inputVal;

        //put objects in a single array
        arrInputVals.push(objInputVal);
      }
    });

    //hide the full search form, show the mini click-to-search form
    $(".jq-form").hide(100);

    //show the header-style form
    $('.mini-form').show('fast');

    //get the results from the API
    getResFromAPI(arrInputVals, displayAPISearchData);
  });

  //re-open the search-form when the search button is clicked
  $('.searchAgain')
    .on('click', function(ev){
      ev.preventDefault();
      console.log('clicked!');
      //hide the full search form, show the mini click-to-search form
      $(".jq-form").show('fast');

      //show the header-style form
      $('.mini-form').hide(100);
    })

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

}
$(doEverything);