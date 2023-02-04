import icons from 'url:../../img/icons.svg'
import View from './View';

const Fraction = function(numerator, denominator)
{
    /* double argument invocation */
    if (typeof numerator !== 'undefined' && denominator) {
        if (typeof(numerator) === 'number' && typeof(denominator) === 'number') {
            this.numerator = numerator;
            this.denominator = denominator;
        } else if (typeof(numerator) === 'string' && typeof(denominator) === 'string') {
            // what are they?
            // hmm....
            // assume they are ints?
            this.numerator = parseInt(numerator);
            this.denominator = parseInt(denominator);
        }
    /* single-argument invocation */
    } else if (typeof denominator === 'undefined') {
        num = numerator; // swap variable names for legibility
        if (typeof(num) === 'number') {  // just a straight number init
            this.numerator = num;
            this.denominator = 1;
        } else if (typeof(num) === 'string') {
            var a, b;  // hold the first and second part of the fraction, e.g. a = '1' and b = '2/3' in 1 2/3
                       // or a = '2/3' and b = undefined if we are just passed a single-part number
            var arr = num.split(' ')
            if (arr[0]) a = arr[0]
            if (arr[1]) b = arr[1]
            /* compound fraction e.g. 'A B/C' */
            //  if a is an integer ...
            if (a % 1 === 0 && b && b.match('/')) {
                return (new Fraction(a)).add(new Fraction(b));
            } else if (a && !b) {
                /* simple fraction e.g. 'A/B' */
                if (typeof(a) === 'string' && a.match('/')) {
                    // it's not a whole number... it's actually a fraction without a whole part written
                    var f = a.split('/');
                    this.numerator = f[0]; this.denominator = f[1];
                /* string floating point */
                } else if (typeof(a) === 'string' && a.match('\.')) {
                    return new Fraction(parseFloat(a));
                /* whole number e.g. 'A' */
                } else { // just passed a whole number as a string
                    this.numerator = parseInt(a);
                    this.denominator = 1;
                }
            } else {
                return undefined; // could not parse
            }
        }
    }
    this.normalize();
}
class RecipeView extends View {
    _parentElement = document.querySelector('.recipe');
    _errorMessage= "Cannot find The Recipe ,please try another";
    _message = "";

    _generateMarkup(){
                
        return `
            <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
            <h1 class="recipe__title">
                <span>${this._data.title}</span>
            </h1>
            </figure>

            <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
                <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
                <span class="recipe__info-text">servings</span>

                <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings -1 }">
                    <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings +1 }">
                    <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                </button>
                </div>
            </div>

            <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                <svg>
                <use href="${icons}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round btn--bookmark">
                <svg class="">
                <use href="${icons}#icon-bookmark${this._data.bookmarked ?'-fill':''}"></use>
                </svg>
            </button>
            </div>

            <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
            ${ this._data.ingredients.map(this._generateMarkupIngredient).join('')
            }
                
            </ul>
            </div>

            <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
                directions at their website.
            </p>
            <a
                class="btn--small recipe__btn"
                href="${this._data.sourceUrl}"
                target="_blank"
            >
            
                <span>Directions</span>
                <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-right"></use>
                </svg>
            </a>
            </div>
            `;
            
    }
  

    renderError(message =this._errorMessage){
        const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
        `;
        this. _clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }
    renderMessage(message =this._message){
        const markup = `<div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>
        ${message}
        </p>
      </div>
        `;
        this. _clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }
    _generateMarkupIngredient(ingredient){
        return `<li class="recipe__ingredient">
        <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ingredient.quantity?new Fraction(ingredient.quantity).toString():""}</div>
        <div class="recipe__description">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.description}
        </div>
    </li>`
    }
    addHandlerRender(handler){
        ['hashchange','load'].forEach(ev => window.addEventListener(ev,handler));
    }
    addHandlerUpdateServings(handler) {
        this._parentElement.addEventListener('click', function (e) {
          const btn = e.target.closest('.btn--update-servings');
          if (!btn) return;
          const { updateTo } = btn.dataset;
          console.log(updateTo);
          if (+updateTo > 0) handler(+updateTo);
        });
      }
    addHandlerAddBookmark(handler){
        this._parentElement.addEventListener('click',function(e) {
            console.log("1111");
            const btn = e.target.closest('.btn--bookmark');
            if (!btn) return;
            handler();
        })
    }

}
export default new RecipeView();
