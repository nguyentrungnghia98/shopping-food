import axios from "axios";
import { proxy, key } from "../config/config";
import { Fraction } from "fractional";
const formatCount = count => {
  if (count) {
    // count = 2.5 --> 5/2 --> 2 1/2
    // count = 0.5 --> 1/2
    const newCount = Math.round(count * 10000) / 10000;
    const [int, dec] = newCount
      .toString()
      .split(".")
      .map(el => parseInt(el, 10));

    if (!dec) return newCount.toString();

    if (int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  return "?";
};
export default class Recipe {
  constructor(id) {
    this.id = id;
    this.isLiked = false;
  }
  async getRecipeByID() {
    try {
      const res = await axios(
        `${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      //  this.image_url = res.data.recipe.image_url ;
      //  this.ingredients = res.data.recipe.ingredients ;
      //  this.publisher = res.data.recipe.publisher ;
      //  this.source_url = res.data.recipe.source_url ;
      //  this.title = res.data.recipe.title ;
      //  this.calcTime();
      //  this.calcServings();
      this.data = {
        image_url: res.data.recipe.image_url,
        ingredients: res.data.recipe.ingredients,
        publisher: res.data.recipe.publisher,
        source_url: res.data.recipe.source_url,
        title: res.data.recipe.title,
        recipe_id: this.id,
        calcTime: function() {
          // Assuming that we need 15 min for each 3 ingredients
          const numIng = this.ingredients.length;
          const periods = Math.ceil(numIng / 3);
          this.time = periods * 15;
        },

        calcServings: function() {
          this.servings = 4;
        }
      };
      this.data.calcTime();
      this.data.calcServings();
    } catch (error) {
      console.log(error);
    }
  }
  updataNumber(check) {
    if (check === "inc") {
      // serving = 4 => 4 1/2
      //cur serving = 5 => (4 + 4/4) (1/2 + 1/2/4)

      this.data.ingredients.forEach(el => {
        const arr = el.number.split(" ");
        let count = parseInt(arr[0]) + parseInt(arr[0]) / this.data.servings;
        if (arr.length === 2) {
          const tmp = eval(arr[1]) + eval(arr[1]) / this.data.servings;
          count += tmp;
        }
        el.number = formatCount(count);
      });
      this.data.servings++;
    } else {
      if (this.data.servings >= 1) {
        this.data.ingredients.forEach(el => {
          const arr = el.number.split(" ");
          let count = parseInt(arr[0]) - parseInt(arr[0]) / this.data.servings;
          if (arr.length === 2) {
            const tmp = eval(arr[1]) - eval(arr[1]) / this.data.servings;
            count += tmp;
          }
          el.number = formatCount(count);
        });
        this.data.servings--;
      }
    }
  }
  getDataRecipe() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredient = this.data.ingredients.map(ingredient => {
      // 1) Delete (string) replace to ' '
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // 2) Configure the units by change the unitslong to unitsShort
      unitsLong.forEach((val, index) => {
        ingredient = ingredient.replace(val, unitsShort[index]);
      });

      // 3) Get value to the Ingredient Object
      const splitIng = ingredient.split(" ");
      const indexUnit = splitIng.findIndex(el => units.includes(el));
      let objIng;
      //Case 1: Ingredient has unit
      if (indexUnit > -1) {
        // Case 1: 1 1/2 unit ingre
        // Case 2: 1 unit ingre
        const arrNumber = splitIng.slice(0, indexUnit);
        let number = arrNumber[0];
        if (arrNumber.length === 2) {
          number += " " + arrNumber[1];
        }

        objIng = {
          number,
          unit: splitIng[indexUnit],
          ingredient: splitIng.slice(indexUnit + 1).join(" ")
        };
      } else if (parseInt(splitIng[0])) {
        // Case 2: No unit but the first one is number
        let number = splitIng[0];
        let stringIngre = splitIng.slice(2).join(" ");
        if (parseInt(splitIng[1])) {
          number += " " + parseInt(splitIng[1]);
        } else {
          stringIngre = splitIng[1] + " " + stringIngre;
        }

        objIng = {
          number,
          unit: "",
          ingredient: stringIngre
        };
      } else if (indexUnit === -1) {
        // Case 3: no unit no first number
        objIng = {
          number: "1",
          unit: " ",
          ingredient
        };
      }
      return objIng;
    });
    this.data.ingredients = newIngredient;
  }
}
