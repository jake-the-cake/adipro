"use strict";
window.addEventListener('DOMContentLoaded', startApp);
const utils = {
    parseAllInts: (value) => { var _a; return Number((_a = value.match(/[0-9]/g)) === null || _a === void 0 ? void 0 : _a.join('')) || 0; }
};
const config = {
    currentPage: 1,
    title: (index) => `form-page-${index + 1}-title`
};
class QuiggleMultiPageForm {
    constructor(id) {
        this.titleContent = [];
        this.container = document.getElementById(id);
        this.titleElements = Array.from(document.getElementById('form-header').children);
        this.titleElements.forEach((element) => {
            this.titleContent.push(element.firstElementChild);
        });
        this.forms = Array.from(document.getElementById('form-display').children);
        this.forms.forEach((form) => {
            form.querySelector('button').onpointerup = (e) => {
                e.preventDefault();
                config.currentPage++;
                this.changeActiveElement(QuiggleMultiPageForm.classes.hideTitle);
            };
        });
        console.log(this);
    }
    changeActiveElement(className) {
        var _a;
        // const makeActive = this.titleContent[config.currentPage - 1]
        const makeActive = (_a = document.getElementById(`form-page-${config.currentPage}-title`)) === null || _a === void 0 ? void 0 : _a.firstElementChild;
        console.log(makeActive.parentNode);
        // if (typeof makeActive === 'number' || Number(makeActive) * 0 === 0) makeActive = this.titleElements[makeActive as number - 1]
        // if (typeof makeActive === 'string') {
        // makeActive = document.getElementById(makeActive)!
        // if (!makeActive) return console.warn(new Error('cannot locate id: ' + makeActive))
        // }
        // config.currentPage = utils.parseAllInts(makeActive.id)
        this.titleContent.filter(element => utils.parseAllInts(element.id) !== config.currentPage).forEach((element) => {
            console.log(element);
            QuiggleDom.addClass(element, className);
        });
        console.log(this.titleContent);
        QuiggleDom.removeClass(makeActive, className);
    }
}
QuiggleMultiPageForm.classes = {
    hideTitle: 'form-title__hidden'
};
class QuiggleDom {
    constructor(app) {
        this.app = app;
    }
    static addClass(element, name) {
        element.classList.add(name);
    }
    static removeClass(element, name) {
        element.classList.remove(name);
    }
    static toggleClass(element, name) {
        element.classList.toggle(name);
    }
}
const quiggleMPF = new QuiggleMultiPageForm('get-started-app');
function startApp() {
    var _a, _b;
    const app = document.getElementById('get-started-app');
    if (!app)
        return console.error(new Error('Application not found.'));
    const [...titles] = Array.from((_b = (_a = document.getElementById('form-header')) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : []);
    if (titles.length < 1)
        return console.error(new Error('No form titles found'));
    titles.forEach((title, i) => {
        title.id = config.title(i);
    });
    quiggleMPF.changeActiveElement('form-app__hidden');
}
