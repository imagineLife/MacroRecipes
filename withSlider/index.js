const API_URL = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?limitLicense=false&number=30&tags=`
var el, newPoint, newPlace, offset;

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
        // console.log(APIResults);
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

function getInputText(){
  $('button')
    .on('click', function(ev){
      ev.preventDefault();
      var searchedTerm = $('.userInput').val();
      // console.log(searchedTerm);
  
      //deselct input, clear input value
      $(this)
        .siblings('.userInput')
        .trigger('blur');
      $(this)
        .siblings('button')
        .trigger('blur');
      $('.jq-results')
        .html('');


        getResFromAPI(searchedTerm, displayAPISearchData);
    });
}
   
  // Select all range inputs, watch for change
  $("input[type='range']").change(function() {
   // Cache this for efficiency
   el = $(this);
   
   // Measure width of range input
   width = el.width();
   
   // Figure out placement percentage between left and right of input
   newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
    
    offset = -1;

   // Prevent bubble from going beyond left or right (unsupported browsers)
   if (newPoint < 0) { newPlace = 0; }
   else if (newPoint > 1) { newPlace = width; }
   else { newPlace = width * newPoint + offset; offset -= newPoint; }
   
   console.log(el.val);
   // Move bubble
   el
     .next("output")
     .css({
       left: newPlace,
       marginLeft: offset + "%"
     })
       .text(el.val());
   })
   // Fake a change to position bubble at page load
   .trigger('change');

$(getInputText);
