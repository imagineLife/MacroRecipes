const getRecipesURI = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addrecipeinformation=true&number=30&offset=0&random=false&`
const getSingleURI = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/`;
let arrInputVals = [];
let arrIngredients = ['chicken', 'onions', 'asparagus', 'ginger', 'lemon juice', 'potatoes', 'carrots', 'beef', 'tomatoes', 'apples', 'salmon', 'beets', 'parsley'];
function doEverything(){
  //removes gray outline on touch devices
  document.addEventListener("touchstart", function(){}, true);

  let randomIngredient = arrIngredients[Math.floor(Math.random()*arrIngredients.length)];
  let randomIngredient2 = arrIngredients[Math.floor(Math.random()*arrIngredients.length)];
  let randomIngredient3 = arrIngredients[Math.floor(Math.random()*arrIngredients.length)];
  let twoIngredients = "";
  if(randomIngredient == randomIngredient2){
    twoIngredients = randomIngredient+", "+randomIngredient3;
  }else{
    twoIngredients = randomIngredient+", "+randomIngredient2;
  }
  // console.log(randomIngredient+", "+randomIngredient2+", "+randomIngredient3);
  $('#includeIngredients').attr("placeholder", twoIngredients);

  function displayAPISearchData(data){
      let recipesVar = data.results;
      let APIResults = "";

      for(i=0; i<recipesVar.length; i++){
          let curRecipe = recipesVar[i];
          const rowBeginning = `<div class="row">`;
          const rowEnding = `</div>`;
          let boxItem = `<div class="box col-4">
                  <a href="" class="testPop" data-popup-open='popup-feedback' data-title="${curRecipe.title}"data-fat="${curRecipe.fat}"  data-carbs="${curRecipe.carbs}" data-protein="${curRecipe.protein}" data-calories="${curRecipe.calories}" id="${curRecipe.id}">
                    <img src="${curRecipe.image}" alt="${curRecipe.title}">  
                    <div class="boxDescription">
                      <h3>${curRecipe.title}</h3>
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

  //opening the macro-popup
  function showForceEntryPopup() {
    const feedback = $('#forceEntryPopup').find('.forcePop-inner');
    var thisButtonPopupAttr = $('.forcePop')
                              .attr('data-popup');
    $('[data-popup="' + thisButtonPopupAttr + '"]').fadeIn(200);
  }

  //opening the macro-popup
  function showMacroPopup(recipeData) {
    const feedback = $('.popup-inner');
    const  feedbackUL = feedback.find('ul');
    const feedbackButon = feedback.find('button');
    var thisPopOpenAttr = $('.testPop')
                              .attr('data-popup-open');

    //set the Macro text based on API results
    feedback.find('.txt-center').html(`${recipeData.title} <span>Macronutrients:</span>`);
    feedbackUL.append(`
      <li>Fat: <span>${recipeData.fat}<span></li>
      <li>Carbohydrates: <span>${recipeData.carbohydrates}</span></li>
      <li>Calories: <span>${recipeData.calories}</span></li>
      <li>Protein: <span>${recipeData.protien}</span></li>
      <li class="hideID">${recipeData.id}</li>`
    );

    $('[data-popup="' + thisPopOpenAttr + '"]').fadeIn(100);
  }

  //send for and return the API serach results
  function getResFromAPI(searchVal, callback) {
    let searchParams = '';
    let searchSnippet = '';

    for (i = 0; i < searchVal.length; i++){
      let resObj = searchVal[i];
      let firstItem = Object.keys(resObj)[0];
      if (firstItem != 'includeIngredients'){
        let itemName = Object.keys(resObj)[1];
        let itemVal = resObj[Object.keys(resObj)[1]];
        let minMaxVal = resObj.minMax;
        searchSnippet = '&' + minMaxVal + itemName + '=' + itemVal;
      }else{
        let itemName = Object.keys(resObj)[0];
        let itemVal = resObj[Object.keys(resObj)[0]];        
        searchSnippet = '&' + itemName + '=' + itemVal;
      }
      searchParams += searchSnippet;
    }

    const infoSettings = {
      url: getRecipesURI+`${searchParams}`,  
      dataType: 'json',
      success: callback,
      error: function(err) { alert(err); },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-Mashape-Authorization", "Dw5Du2x9f1mshumfYcTmv8RduW9Op1On2QIjsnwkVvyQwCuMSb");
      }
    };

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

  
  function showRecipeScreenView(){
    $(".jq-form").hide(100);
    $('.mini-form').show('fast');
  }

  function showSingleRecipe(APIRresults){
    let recipeURL = APIRresults.sourceUrl;
      window.open(recipeURL);
  };

  function getSingleRecipe(recID, callback){
    const ajaxSettings = {
      url: getSingleURI+`${recID}/information?includenutrition=false`,
      async:    false,
      dataType: 'json',
      success: callback,
      error: function(err) { alert(err); },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-Mashape-Authorization", "Dw5Du2x9f1mshumfYcTmv8RduW9Op1On2QIjsnwkVvyQwCuMSb");
      }
    };

    $.ajax(ajaxSettings);

    showRecipeScreenView();
  };

  function moveOnOrNo(obj) {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += ( obj[el] );
      }
    }
    if(sum.length > 1){
      processForm();
      return sum;
    }else{
      showForceEntryPopup();
    }
  };

  function processForm(){
    let arrInputVals = [];
    let ingredientValue = $('.userInput').val();

    $('.jq-results')
      .html('');

    $(".jq-form input[type=number], .jq-form .userInput").each(function() {

      if( this.value == '') {
      }else{
        let objInputVal = {};
        let inputKey = this.name;
        let inputVal = this.value;

        if(this.name != 'includeIngredients'){
          let minMaxVal = $(this)
          .parent()
          .prev()
          .children('.slider')
          .children('.off')
          .html();
          objInputVal['minMax'] = minMaxVal.toLowerCase();
        }
        
        objInputVal[inputKey] = inputVal;

        arrInputVals.push(objInputVal);
      }
    });


    getResFromAPI(arrInputVals, displayAPISearchData);

    showRecipeScreenView();

  };

  //moving visually from popup to the selected recipe webpage
  //on 'go to recipe' click
  $('#feedbackPopup')
    .on('click', 'button', function(ev){
      let recipeID = $(this)
        .siblings('ul')
        .find('.hideID')
        .html();

      getSingleRecipe(recipeID, showSingleRecipe);
    });

  //closing the forceEntry-dialogue
  $('#forceEntryPopup').on('click', '#close-feedback-modal', function (e) {
    e.preventDefault();
    //close the popup
    var targetPopupClass = $(this).attr('data-popup-close');
    $('[data-popup="' + targetPopupClass + '"]').fadeOut(300);
  });

  //closing the feedback-dialogue
  $('#feedbackPopup').on('click', '#close-feedback-modal', function (e) {
    e.preventDefault();

    $('.popup-inner')
      .find('.txt-center')
      .html('');

    $('.popup-inner')
      .find('ul')
      .html('');

    //close the popup
    var targetPopupClass = $(this).attr('data-popup-close');
    $('[data-popup="' + targetPopupClass + '"]').fadeOut(300);
  });
  
  $('.jq-form').on('submit', function(ev){
    ev.preventDefault();

    let inputList = $(".jq-form input[type=number]");
    let inputVals = {};
    for (i = 0; i < inputList.length; i++){
      inputVals[i] = inputList[i].value;
    };

    moveOnOrNo(inputVals);
  });

  //re-open the search-form when the search button is clicked after a result has been retrieved from the API
  $('.searchAgain')
    .on('click', function(ev){
      ev.preventDefault();
      $(".jq-form").show('fast');
      $('.mini-form').hide(100);
    });


  $('.jq-results')
  .on('click', 'a', function(ev){
    ev.preventDefault();   

    fat = $(this).data('fat');
    cals = $(this).data('calories');
    carbs = $(this).data('carbs');
    pros = $(this).data('protein');
    recipeID = this.id;
    title = $(this).data('title');

    var theseMacros = {};

    theseMacros['fat'] = fat;
    theseMacros['calories'] = cals;
    theseMacros['carbohydrates'] = carbs;
    theseMacros['protien'] = pros;
    theseMacros['id'] = recipeID;
    theseMacros['title'] = title;

    showMacroPopup(theseMacros);
  });


  // get the background-color of the toggle switch
  $('.jq-form')
  .children('#macroWrapper')
  .children('.switch')
  .children(':checkbox')
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
