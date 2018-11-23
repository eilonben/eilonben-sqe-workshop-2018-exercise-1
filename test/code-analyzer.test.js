import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parseProgram} from '../src/js/code-analyzer';
import {createGUITable} from '../src/js/code-analyzer';
describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });
});

describe('basic Tests', () => {
    it ('parsing empty' , ()=> {assert.equal(
        JSON.stringify(parseProgram(parseCode(''))), '[]'
    );
    });
    it ('parsing non value + value var decl' , () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let g = 3;\n' +
                'let x;\n'))), '[[1,"VariableDeclarator","g","","3"],[2,"VariableDeclarator","x","",""]]'
        );
    });
});

describe('If and While tests', () => {
    it(' - parsing an if else statement correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let a = 2 \n' +
                'if (a>2)\n' +
                'a = 3\n' +
                'else \n' +
                'a = 1'))), '[[1,"VariableDeclarator","a","","2"],[2,"IfStatement","","a > 2",""],[3,"AssignmentExpression","a","","3"],[5,"AssignmentExpression","a","","1"]]'
        );
    });
    it (' - parsing a while statement correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let a = 4;\n' +
                'while (a<5){\n' +
                'a = a +1;\n' +
                '}\n'))),'[[1,"VariableDeclarator","a","","4"],[2,"WhileStatement","","a < 5",""],[3,"AssignmentExpression","a","","a + 1"]]'
        );
    });
});
describe('For tests', () => {
    it(' - parsing a one-line for statement ', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('for (let x =0; x<5; x++);'))),
            '[[1,"ForStatement","","x < 5",""],[1,"VariableDeclarator","x","","0"]]'
        );
    });

    it(' - parsing a for statement with multiple var decl',() => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('for (let x =0,y = 3; x<5; x++)\n' +
                'y = y + 4;\n'))),
            '[[1,"ForStatement","","x < 5",""],[1,"VariableDeclarator","x","","0"],[1,"VariableDeclarator","y","","3"],[2,"AssignmentExpression","y","","y + 4"]]'
        );
    });
});

describe('function tests', () => {
    it(' - parsing a function declaration with multiple var decl ', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function foo (a){\n' +
                'return a;}\n'))),
            '[[1,"FunctionDeclaration","foo","",""],[1,"Identifier","a","",""],[2,"ReturnStatement","","","a"]]'
        );
    });
    it(' - parsing multiple function declarations ', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function foo(g){\n' +
                'let low;\n' +
                'return g;}\n' +
                'function goo(a){\n' +
                'return a;}'))),
            '[[1,"FunctionDeclaration","foo","",""],[1,"Identifier","g","",""],[2,"VariableDeclarator","low","",""],[3,"ReturnStatement","","","g"],[4,"FunctionDeclaration","goo","",""],[4,"Identifier","a","",""],[5,"ReturnStatement","","","a"]]'
        );
    });
});
describe('final tests 1', () => {
    it(' - parsing a function with multiple expressions ', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function test(a,b,c){ \n' +
                '             let a =5;\n' +
                '                while (a<10){\n' +
                '                if (b > a){\n' +
                '                b = b-1;\n' +
                '                a = a+1;\n' +
                '                }else if (b < a){\n' +
                '                b = b+1;\n' +
                '                a = a-1;\n' +
                '                }\n' +
                '                else{\n' +
                '                c = c +1;\n' +
                '                }\n' +
                '                a = a + 1;\n' +
                '                }\n' +
                '                return c;\n' +
                '}'))), '[[1,"FunctionDeclaration","test","",""],[1,"Identifier","a","",""],[1,"Identifier","b","",""],[1,"Identifier","c","",""],[2,"VariableDeclarator","a","","5"],[3,"WhileStatement","","a < 10",""],[4,"IfStatement","","b > a",""],[5,"AssignmentExpression","b","","b - 1"],[6,"AssignmentExpression","a","","a + 1"],[7,"IfStatement","","b < a",""],[8,"AssignmentExpression","b","","b + 1"],[9,"AssignmentExpression","a","","a - 1"],[12,"AssignmentExpression","c","","c + 1"],[14,"AssignmentExpression","a","","a + 1"],[16,"ReturnStatement","","","c"]]');});});

describe('final tests 2', () => {
    it(' - parsing a function with multiple expressions ', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function onlyfor(a,b,c){\n' +
                'for (let i=0; i<5; i++);\n' +
                'for (let d = 4; d<12; d++){\n' +
                'if (d < b )\n' +
                'return b;\n' +
                '}\n' +
                'return a;\n' +
                '}'))), '[[1,"FunctionDeclaration","onlyfor","",""],[1,"Identifier","a","",""],[1,"Identifier","b","",""],[1,"Identifier","c","",""],[2,"ForStatement","","i < 5",""],[2,"VariableDeclarator","i","","0"],[3,"ForStatement","","d < 12",""],[3,"VariableDeclarator","d","","4"],[4,"IfStatement","","d < b",""],[5,"ReturnStatement","","","b"],[7,"ReturnStatement","","","a"]]'
        );
    });
    it (' - make Table test', () => {
        assert.equal(
            JSON.stringify(createGUITable(parseProgram(parseCode('function foo(a) {\n' +
                'let g = 3; }' )))), '"<table border=1><tr>\\n    <th>Line</th>\\n    <th>Type</th> \\n    <th>Name</th>\\n    <th>Condition</th>\\n    <th>Value</th>\\n  </tr><tr><td>1</td><td>FunctionDeclaration</td><td>foo</td><td></td><td></td></tr><tr><td>1</td><td>Identifier</td><td>a</td><td></td><td></td></tr><tr><td>2</td><td>VariableDeclarator</td><td>g</td><td></td><td>3</td></tr></table>"');
    });
});