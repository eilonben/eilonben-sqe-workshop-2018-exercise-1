import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{ loc: true });
};
const isFunction = (x) => x.type === 'FunctionDeclaration';
const isValDecl  = (x) => x.type === 'VariableDeclaration';
const isWhile = (x) => x.type === 'WhileStatement';
const isIf = (x) => x.type === 'IfStatement';
const isFor = (x) => x.type === 'ForStatement';
const isExpression = (x) => x.type === 'ExpressionStatement';

const parseBody = (objectArray) =>{
    let output = [];
    if (objectArray === null || objectArray.type === 'EmptyStatement')
        return output;
    if (objectArray.type === 'BlockStatement') {
        for (var i = 0; i < objectArray.body.length; i++) {
            output = output.concat(parseAll(objectArray.body[i]));
        }
        return output;
    }
    output = output.concat(parseAll(objectArray));
    return output;

};

const parseFunc = (funcObj) => {
    let output =[];
    output.push([funcObj.loc.start.line , funcObj.type , funcObj.id.name,'' , '']);
    funcObj.params.forEach((id) =>
        output.push([id.loc.start.line,id.type,id.name,'','']));
    return output.concat(parseBody(funcObj.body));
};

const parseProgram = (program) => {
    let output = [] ;
    for (var i=0; i<program.body.length; i++){
        output = output.concat(parseAll(program.body[i]));
    }
    return output;
};

const parseSingle = (jObject) => {
    let output = [];
    isValDecl(jObject) ? output = output.concat(parseValDecl(jObject)):
        output = output.concat(parseAssignment(jObject));
    return output;
};

const parseValDecl = (decl) => {
    let output = [];
    decl.declarations.forEach ( (varD) => {
        let rhs ='';
        if (varD.init !== undefined && varD.init !== null ) {
            rhs = escodegen.generate(varD.init);
        }
        output.push([varD.loc.start.line,varD.type,varD.id.name,'',rhs]);});
    return output;
};

const parseAssignment = (expr) => {
    return [[expr.loc.start.line,expr.expression.type,expr.expression.left.name,'',escodegen.generate(expr.expression.right)]];
};

const parseCompound = (expr) => {
    let output = [];
    isFor(expr) ?  output=output.concat(parseFor(expr)):
        isIf(expr) ? output=output.concat(parseIf(expr)):
            output = output.concat (parseWhile(expr));
    return output;
};

const parseWhile = (exp) => {
    let output = [];
    output.push([exp.loc.start.line,exp.type,'',escodegen.generate(exp.test),'']);
    output = output.concat(parseBody(exp.body));
    return output;
};

const parseIf = (exp) => {
    let output = [];
    output.push([exp.loc.start.line, exp.type, '', escodegen.generate(exp.test), '']);
    output = output.concat(parseBody(exp.consequent));
    output = output.concat(parseBody(exp.alternate));
    return output;
};

const parseFor = (forExp) => {
    let output = [];
    output.push([forExp.loc.start.line,forExp.type,'',escodegen.generate(forExp.test),'']);
    output = output.concat(parseValDecl(forExp.init));
    output = output.concat(parseBody(forExp.body));
    return output;
};

const parseReturn = (retExp) => {
    return [[retExp.loc.start.line,retExp.type,'','',escodegen.generate(retExp.argument)]];
};

const parseAll = (jObject) => {
    let output = [];
    isFunction(jObject) ? output = output.concat(parseFunc(jObject)):
        isValDecl(jObject) | isExpression(jObject)  ? output = output.concat(parseSingle(jObject)):
            isWhile(jObject) | isFor(jObject) | isIf(jObject) ? output = output.concat(parseCompound(jObject)):
                output =output.concat(parseReturn(jObject));
    return output;
};

function createGUITable(Table) {
    var htmlCode = '<table border=1>';
    htmlCode +=  '<tr>\n' +
        '    <th>Line</th>\n' +
        '    <th>Type</th> \n' +
        '    <th>Name</th>\n' +
        '    <th>Condition</th>\n' +
        '    <th>Value</th>\n' +
        '  </tr>';
    for(var i=0; i<Table.length; i++) {
        htmlCode += '<tr>';
        for(var j=0; j<Table[i].length; j++){
            htmlCode += '<td>'+Table[i][j]+'</td>';
        }
        htmlCode += '</tr>';
    }
    htmlCode += '</table>';
    console.log(JSON.stringify(htmlCode));
    return htmlCode;
}

export {createGUITable};
export {parseProgram};
export {parseCode};
