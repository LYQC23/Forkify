import View from "./View";
import icons from 'url:../../img/icons.svg'
import previewView from "./previewView";
class ResultsView extends View{
    _parentElement = document.querySelector('.results')
    _errorMessage = "cannot find recipe about the key word "
    _generateMarkup(){
        console.log(this._data);
        return this._data.map(result => previewView.render(result, false)).join('')
            
    } 

}
export default new ResultsView();