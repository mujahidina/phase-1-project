document.addEventListener('DOMContentLoaded', () => {
    // SEARCH FOR RECIPES PAGE =======================================================================================================================
    let mealInput = document.querySelector('input');
    let searchButton = document.querySelector('button');
    let imageDiv = document.querySelector('.image');

    searchButton.addEventListener('click', () => {
        let query = mealInput.value;

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                imageDiv.innerHTML = '';

                if (data.meals) {
                    data.meals.forEach(meal => {
                        let h3 = document.createElement('h3');
                        h3.innerHTML = meal.strMeal;
                        imageDiv.appendChild(h3);

                        let img = document.createElement('img');
                        img.src = meal.strMealThumb;
                        imageDiv.appendChild(img);

                        let p = document.createElement('p');
                        p.innerHTML = meal.strInstructions;
                        imageDiv.appendChild(p);
                    });
                } else {
                    alert('Recipe not found');
                }
            })
            .catch(error => {
                console.error('There was an error while fetching the data', error);
            });
    });






    // ADD YOUR OWN RECIPES PAGE ===========================================================================================================
//    POST REQUEST ===============================================
 
    let form = document.getElementById('form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const recipeName = document.getElementById('recipeName').value;
        const description = document.getElementById('description').value;
        const imageUrl = document.getElementById('imageUrl').value;
        submitRecipe(recipeName, description, imageUrl);
    });


    function submitRecipe(recipeName, description, imageUrl) {
      fetch("http://localhost:3000/recipes", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
          },
          body: JSON.stringify({
              Recipe: recipeName,
              Description: description,
              Image: imageUrl,
          }),
      })
      .then((res) => res.json())
      .then((newRecipe) => {
          let cardBody = document.createElement("div");
          cardBody.className = "card-body recipe-card";
  
          let h4 = document.createElement("h4");
          h4.innerHTML = newRecipe.Recipe;
          cardBody.appendChild(h4);
  
          let p = document.createElement("p");
          p.innerHTML = newRecipe.Description;
          cardBody.appendChild(p);
  
          let thumb = document.createElement("img");
          thumb.src = newRecipe.Image;
          cardBody.appendChild(thumb);

          let likesLabel = document.createElement("h3");
          likesLabel.innerHTML = "LIKES:";
          cardBody.appendChild(likesLabel);
          
          let likesCount = document.createElement("h5");
          likesCount.textContent = 0;
          cardBody.appendChild(likesCount);
  
          let editButton = document.createElement("button");
          editButton.innerHTML = "LIKE";
          cardBody.appendChild(editButton);
  
          editButton.addEventListener('click', () => {
              likesCount.textContent = parseInt(likesCount.textContent) + 1;

              let recipeId = newRecipe.id; 
              fetch(`http://localhost:3000/recipes/${recipeId}`, {
                  method: "PATCH",
                  headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                  },
                  body: JSON.stringify({
                      likeCount: parseInt(likesCount.textContent),
                  }),
              })
              .then((res) => res.json())
              .then((updatedRecipe) => {
                  console.log(updatedRecipe);
              })
          });
  
          const recipeContainer = document.getElementById("recipeContainer");
          recipeContainer.appendChild(cardBody);
      })
      .catch((error) => {
          console.error("There was an error while fetching the data", error);
      });
  
      getRecipe();
  }



  
  
    //   GET REQUEST ========================================================================================================================

    function getRecipe() {
        fetch("http://localhost:3000/recipes")
          .then((res) => res.json())
          .then((data) => {
            const recipeContainer = document.getElementById("recipeContainer");
      
            const recipes = data.recipes;
      
            recipes.forEach((recipe) => {
                
              let cardBody = document.createElement("div");
              cardBody.className = "card-body recipe-card";
      
              let h4 = document.createElement("h4");
              h4.innerHTML = recipe.Recipe;
              cardBody.appendChild(h4);
      
              let p = document.createElement("p");
              p.innerHTML = recipe.Description;
              cardBody.appendChild(p);
      
              let thumb = document.createElement("img");
              thumb.src = recipe.Image;
              cardBody.appendChild(thumb);
      
              let editButton = document.createElement("button");
              editButton.innerHTML = "LIKE";
              cardBody.appendChild(editButton);
            
              recipeContainer.appendChild(cardBody);
            });
          })
          .catch((error) => console.error("There was an error while fetching the data", error));
      }              
});
