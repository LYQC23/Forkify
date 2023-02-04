import View from "./View";
import icons from 'url:../../img/icons.svg'
class PaginatinoView extends View{
    _parentElement = document.querySelector('.pagination')

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function (e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }
    _generateMarkup(){

        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerpage);
        const curPage = this._data.page
        //Page 1 
        //      有页
        if(curPage === 1 && numPages>1){
            return ` <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> `
        }
        //Last page
        if(curPage === numPages && numPages>1){
            return ` <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`
        }
        //other page
        if(curPage < numPages){
            return `
            <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button> 
            
            <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
            `
        }
            
        return 'only one'
    } 
     _generateMarkupPreviw(result){
    return ` 
    <li class="preview">
      <a class="preview__link preview__link--active" href="#${result.id}">
        <figure class="preview__fig">
          <img src="${result.image}" alt="${result.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.publisher}</p>
          <div class="preview__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
     `
    } 
}
export default new PaginatinoView();