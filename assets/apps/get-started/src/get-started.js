"use strict";
const errorLog = [];
const elements = {
    page: 1
};
elements.formTitle = document.getElementById('form-title');
if (elements.formTitle === null)
    errorLog.push(new SyntaxError('Missing element with id: form-title'));
elements.formDisplay = document.getElementById('form-display');
if (!elements.formDisplay)
    errorLog.push(new SyntaxError('Missing element with id: form-displaye'));
elements.forms = [...document.querySelectorAll('.form__container')];
if (elements.forms.length === 0)
    errorLog.push(new Error('No forms found.'));
if (errorLog.length > 0) {
    errorLog.forEach(err => {
        console.error(err.name + ':', err.message);
        console.warn(err.stack);
        throw new Error('Aborted.');
    });
}
elements.titles = [...elements.formTitle.children];
if (elements.titles.length === 0)
    errorLog.push(new Error('No titles found.'));
elements.titles.forEach((title, i) => {
    title.id = 'form-title-' + (i + 1);
    if (i + 1 !== elements.page)
        title.style.width = '50px';
});
