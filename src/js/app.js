import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseProgram} from './code-analyzer';
import {createGUITable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let myTable = parseProgram(parsedCode);
        let guiTable = createGUITable(myTable);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        $('#table').append(guiTable);
    });
});


