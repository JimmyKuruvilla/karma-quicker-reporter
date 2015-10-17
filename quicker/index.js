var c = require('colog');
var jsdiff = require('diff');
////todo jimmy on 10/19/15 @ 8:49 AM:works with karma-jasmine 0.1.5. Needs some tweaking to work with karma-jasmine 0.3.6.
////todo jimmy on 10/19/15 @ 8:53 AM: expose theme in config as well
//todo jimmy on 10/16/15 @ 9:32 AM: Allow config object to pass in a custom set of matchers. So if the object is present use it, if not use defaults. If 'append' is passed append config matchers to the TOP of the list to be run first, and then run the default jasmine list. Allows use for any framework.

//Example config
//quickerConfig: {
//  quickQuit: true
//},
//reporters: ['quicker'],

var QuickerReporter = function (baseReporterDecorator, config, logger, helper, formatError) {
  var self = this;
  self.onCompleteError = '';
  self.onSpecFailError = '';
  self.failedSpecs = [];
  var quickerConfig = config.quickerConfig || {};
  var punctuationRe = /[:,\.\n]*$/g; //strip only some chars from end

  baseReporterDecorator(self);

  var theme = {
    expectedVar: 'yellow',
    butString: 'yellow',
    actualVar: 'blue',
    atObj: 'white',
    errorLink: 'blue',
    spy: 'green',
    spyName: 'yellow',
    not: 'red',
    true: 'yellow',
    false: 'red',
    error: 'red',
    default: 'blue',
    diffDefault: 'white',
    added: 'green',
    removed: 'red',
    undefined: 'red',
    quoted: 'yellow',
    bracket: 'magenta', // {}, []
    separator: 'red', //commas,colons
    null: 'red',
    falsy: 'red',
    truthy: 'red',
    match: 'red',
    successHeading: 'green',
    failedHeading: 'yellow',
    timeHeading: 'red',
    testTierDescription: 'blue',
    headingSeparator: 'yellow',
    headingSeparatorChars: ' <:> ',
    testResultDescription: 'red'
  };

  function add(text, varToWrite) {
    self[varToWrite] += text;
  }

  function space(numSpaces) {
    var result = '';
    for (var i = 0; i < numSpaces + 1; i++) {
      result += ' ';
    }

    return result + ' ';
  }

  function themeify(themeID, string) {
    return c.color(string, theme[themeID]);
  }

  function addHeader(browser, varToWrite) {
    add([
      ('\n' + browser + ':'),
      themeify('successHeading', 'Success:'),
      browser.lastResult.success + ',',
      themeify('failedHeading', 'Failed:'),
      browser.lastResult.failed + ',',
      themeify('timeHeading', 'Time:'),
      browser.lastResult.totalTime / 1000,
      '\n',
    ].join(' '), varToWrite)
  }

  function formatError(error) {
    var result;
    var expectedSpyRe = '(Error:.*spy (.*) ';
    var expectedRe = '(.*Expected (.*) '
    var postAssertionRe = '(.*).)';
    var atObjRe = '[\\s\\S]*(at.*)';
    var errorLinkRe = '((http://.*))';

    var toHaveBeenCalledWithRe = new RegExp(expectedSpyRe + 'to have been called with) (.*) but actual calls were (.*)' + atObjRe + errorLinkRe, 'g');
    var notToHaveBeenCalledWithRe = new RegExp(expectedSpyRe + 'not to have been called with) (.*) but it was.' + atObjRe + errorLinkRe, 'g');
    var notToHaveBeenCalledRe = new RegExp(expectedSpyRe + 'not to have been called.)' + atObjRe + errorLinkRe, 'g');
    var toHaveBeenCalledRe = new RegExp(expectedSpyRe + 'to have been called.)' + atObjRe + errorLinkRe, 'g');

    var notToEqualRe = new RegExp(expectedRe + 'not to equal' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toEqualRe = new RegExp(expectedRe + 'to equal' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeRe = new RegExp(expectedRe + 'not to be' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeRe = new RegExp(expectedRe + 'to be' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeDefinedRe = new RegExp(expectedRe + 'not to be defined' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeDefinedRe = new RegExp(expectedRe + 'to be defined' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeUndefinedRe = new RegExp(expectedRe + 'to be undefined' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeUndefinedRe = new RegExp(expectedRe + 'not to be undefined' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToContainRe = new RegExp(expectedRe + 'not to contain' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toContainRe = new RegExp(expectedRe + 'to contain' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToMatchRe = new RegExp(expectedRe + 'not to match' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toMatchRe = new RegExp(expectedRe + 'to match' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeTruthyRe = new RegExp(expectedRe + 'not to be truthy' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeTruthyRe = new RegExp(expectedRe + 'to be truthy' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeFalsyRe = new RegExp(expectedRe + 'not to be falsy' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeFalsyRe = new RegExp(expectedRe + 'to be falsy' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeNull = new RegExp(expectedRe + 'not to be null' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeNull = new RegExp(expectedRe + 'to be null' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeGreaterThanRe = new RegExp(expectedRe + 'not to be greater than' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeGreaterThanRe = new RegExp(expectedRe + 'to be greater than' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToBeLessThanRe = new RegExp(expectedRe + 'not to be less than' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toBeLessThanRe = new RegExp(expectedRe + 'to be less than' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var notToThrowRe = new RegExp(expectedRe + 'not to throw' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var toThrowRe = new RegExp(expectedRe + 'to throw' + postAssertionRe + atObjRe + errorLinkRe, 'g');
    var generalErrorRe = /(.*Error.*)[\s\S]*(at null.*)(\(http:\/\/.*)/g;

    var matcherResAndFns = [
      {re: notToHaveBeenCalledWithRe, fn: notToHaveBeenCalledWithFn},
      {re: toHaveBeenCalledWithRe, fn: toHaveBeenCalledWithFn},
      {re: notToHaveBeenCalledRe, fn: toHaveBeenCalledFn},
      {re: toHaveBeenCalledRe, fn: toHaveBeenCalledFn},
      {re: notToBeUndefinedRe, fn: compareNoExpectedNoJSON},
      {re: toBeUndefinedRe, fn: compareNoExpectedNoJSON},
      {re: notToBeDefinedRe, fn: compareNoExpectedNoJSON},
      {re: toBeDefinedRe, fn: compareNoExpectedNoJSON}, //unused - instead caught by ReferenceError
      {re: notToEqualRe, fn: fullCompare},
      {re: toEqualRe, fn: fullCompare},
      {re: notToBeTruthyRe, fn: compareNoJSON},
      {re: toBeTruthyRe, fn: compareNoJSON},
      {re: notToBeFalsyRe, fn: compareNoJSON},
      {re: toBeFalsyRe, fn: compareNoJSON},
      {re: notToBeLessThanRe, fn: compareNoJSON},
      {re: toBeLessThanRe, fn: compareNoJSON},
      {re: notToBeGreaterThanRe, fn: compareNoJSON},
      {re: toBeGreaterThanRe, fn: compareNoJSON},
      {re: notToBeNull, fn: compareNoJSON},
      {re: toBeNull, fn: compareNoJSON},
      {re: notToContainRe, fn: compareNoJSON},
      {re: toContainRe, fn: compareNoJSON},
      {re: notToThrowRe, fn: compareNoExpectedNoJSON},
      {re: toThrowRe, fn: compareNoExpectedNoJSON},
      {re: notToMatchRe, fn: compareNoJSON},
      {re: toMatchRe, fn: compareNoJSON},
      {re: notToBeRe, fn: compareNoJSON},
      {re: toBeRe, fn: compareNoJSON},
      {re: generalErrorRe, fn: generalErrorFn},
      {re: /.*/, fn: lastResortFn}
    ];

    function themeifyExcludingEnding(themeID, word) {
      var ending, firstPart;
      var endingIndex = word.search(punctuationRe);

      if (endingIndex !== -1) {
        ending = word.slice(endingIndex);
        firstPart = word.slice(0, endingIndex);
      }

      return themeify(themeID, firstPart) + themeify('separator', ending);
    }

    function formatEndings(word) {
      return word !== ':' ? word.replace(punctuationRe, '') : word;
    }

    function isBracket(word) {
      //closing brackets include the . or , as optional
      var bracketRe = /\{|\}|\[|\]/g;
      var match = word.match(bracketRe);
      if (match !== null) {
        return match[0];
      }
    }

    function isUndefined(word) {
      var undefinedRe = /(undefined)/g;
      var match = word.match(undefinedRe);
      if (match !== null) {
        return match[0];
      }
    }

    function isError(word) {
      var match = word.match(/(.*Error).*/);
      if (match !== null) {
        return match[1];
      }
    }

    function isQuoted(word) {
      var match = word.match(/('.*)|(".*)*/);
      if (match !== null) {
        return match[1];
      }
    }

    function highlightWords(text, spyName) {
      spyName = spyName ? spyName : undefined;

      return text.split(' ').map(function (word) {
        switch (formatEndings(word)) {
          case 'not':
            return themeify('not', word);
            break;
          case 'true':
            return themeify('true', word);
            break;
          case 'false':
            return themeify('false', word);
            break;
          case 'null':
            return themeify('null', word);
            break;
          case 'falsy':
            return themeify('falsy', word);
            break;
          case 'truthy':
            return themeify('truthy', word);
            break;
          case 'match':
            return themeify('match', word);
            break;
          case 'spy':
            return themeify('spy', word);
            break;
          case spyName:
            return themeify('spyName', word);
            break;
          case ':':
            return themeify('separator', word);
            break;
          case isUndefined(formatEndings(word)):
            return themeifyExcludingEnding('undefined', word);
            break;
          case isBracket(formatEndings(word)):
            return themeifyExcludingEnding('bracket', word);
            break;
          case isQuoted(formatEndings(word)):
            return themeifyExcludingEnding('quoted', word);
            break;
          case isError(formatEndings(word)):
            return themeifyExcludingEnding('error', word);
            break;
          default:
            return themeifyExcludingEnding('default', word);
        }
      }).join(' ');
    }

    function getPrettyJSON(actualVar, expectedVar) {
      var diffArray = jsdiff.diffWordsWithSpace(actualVar, expectedVar);

      function prettyPrinter(diff, themeID) {
        return diff.value
          .replace(/{/g, '{\n')
          .replace(/,/g, ',\n')
          .split('\n').map(function (word) {
            return themeify(themeID, word);
          })
          .join('\n' + space(2))
      }

      return diffArray.map(function (diff) {
        return diff.added ? prettyPrinter(diff, 'added') :
          diff.removed ? prettyPrinter(diff, 'removed') :
            prettyPrinter(diff, 'diffDefault');
      }).join('');
    }

    function getErrorString(stringArray) {
      return stringArray.map(function (string) {
        return space(2) + string + '\n';
      }).join('');
    }

    function getErrorLink(errorLink) {
      return errorLink.replace(/http:\/\/.*\/base/, process.cwd()).replace(/\?.*?:/, ':');
    }


    function lastResortFn() {
      return highlightWords(error);
    }

    function generalErrorFn(error, regex) {
      var match = regex.exec(error);
      var errorLine = match[1];
      var atObj = match[2];
      var errorLink = getErrorLink(match[3]);

      return getErrorString([
        highlightWords(errorLine),
        themeify('atObj', atObj) + themeify('errorLink', errorLink)
      ]);
    }

    function compareNoExpectedNoJSON(error, regex) {
      var match = regex.exec(error);
      var errorLine = match[1];
      var actualVar = match[2];
      var expectedVar = match[3];
      var atObj = match[4];
      var errorLink = getErrorLink(match[5]);

      return getErrorString([
        highlightWords(errorLine),
        themeify('atObj', atObj) + themeify('errorLink', errorLink)
      ]);
    }


    function compareNoJSON(error, regex) {
      var match = regex.exec(error);
      var errorLine = match[1];
      var actualVar = match[2];
      var expectedVar = match[3];
      var atObj = match[4];
      var errorLink = getErrorLink(match[5]);

      if (expectedVar.length === 0) {
        return getErrorString([
          highlightWords(errorLine),
          themeify('atObj', atObj) + themeify('errorLink', errorLink)
        ]);
      }
      else {
        return getErrorString([
          highlightWords(errorLine),
          themeify('expectedVar', 'Expected: ' + expectedVar),
          themeify('actualVar', 'Actual: ' + actualVar),
          themeify('atObj', atObj) + themeify('errorLink', errorLink)
        ]);
      }
    }

    function fullCompare(error, regex) {
      var match = regex.exec(error);
      var errorLine = match[1];
      var actualVar = match[2];
      var expectedVar = match[3];
      var atObj = match[4];
      var errorLink = getErrorLink(match[5]);

      return getErrorString([
        highlightWords(errorLine),
        themeify('expectedVar', 'Expected: ' + expectedVar),
        getPrettyJSON(actualVar, expectedVar),
        themeify('actualVar', 'Actual: ' + actualVar),
        themeify('atObj', atObj) + themeify('errorLink', errorLink)
      ]);
    }

    function toHaveBeenCalledFn(error) {
      var match = toHaveBeenCalledRe.exec(error);
      var errorLine = match[1];
      var spyName = match[2];
      var atObj = match[3];
      var errorLink = getErrorLink(match[4]);

      return getErrorString([
        highlightWords(errorLine, spyName),
        themeify('atObj', atObj) + themeify('errorLink', errorLink)
      ]);

    }

    function toHaveBeenCalledWithFn(error) {
      var match = toHaveBeenCalledWithRe.exec(error);
      var errorLine = match[1];
      var spyName = match[2];
      var actualVar = match[3];
      var expectedVar = match[4];
      var atObj = match[5];
      var errorLink = getErrorLink(match[6]);

      return getErrorString([
        highlightWords(errorLine, spyName),
        themeify('expectedVar', 'Expected: ' + expectedVar),
        getPrettyJSON(actualVar, expectedVar),
        themeify('actualVar', 'Actual: ' + actualVar),
        themeify('atObj', atObj) + themeify('errorLink', errorLink)
      ]);

    }

    function notToHaveBeenCalledWithFn(error) {
      var match = notToHaveBeenCalledWithRe.exec(error);
      var errorLine = match[1];
      var spyName = match[2];
      var actualVar = match[3];
      var atObj = match[4];
      var errorLink = getErrorLink(match[5]);

      return getErrorString([
        highlightWords(errorLine, spyName),
        themeify('actualVar', 'Actual: ' + actualVar),
        themeify('atObj', atObj) + themeify('errorLink', errorLink)
      ]);

    }

    matcherResAndFns.some(function (matcher) {
      if (matcher.re.test(error)) {

        matcher.re.lastIndex = 0;
        result = matcher.fn(error, matcher.re);
        return true;
      }
    });

    if (result) {
      return result;
    }
    else {
      return error;
    }
  }

  function outputMessage(testResult, varToWrite) {
    //karma-quicker-reporter <:> error types <:>
    testResult.suite.forEach(
      function (testTierDescription, index) {
        add(
          themeify('testTierDescription', testTierDescription) +
          themeify('headingSeparator', theme.headingSeparatorChars), varToWrite);
      });

    //toMatch should colorize error output
    add('\n' + themeify('testResultDescription', testResult.description) + '\n', varToWrite);

    //output each it block's formatted test result data, quickQuit if enabled
    if (quickerConfig.quickQuit) {
      var firstFailedExpect = formatError(testResult.log[0]);
      add(firstFailedExpect, varToWrite);
    }
    else {
      testResult.log.forEach(
        function (log) {
          add(formatError(log), varToWrite);
          add('\n', varToWrite);
        });
    }

    add('\n', varToWrite);
  }

  self.onRunComplete = function (browsers, testResults) {
    browsers.forEach(
      function (browser) {
        if (self.failedSpecs[browser.id]) {
          addHeader(browser, 'onCompleteError');

          if (quickerConfig.quickQuit) {
            var firstFailedTest = self.failedSpecs[browser.id][0];
            outputMessage(firstFailedTest, 'onCompleteError');
          }
          else {
            self.failedSpecs[browser.id].forEach(
              function (testResult) {
                outputMessage(testResult, 'onCompleteError');
              });
          }

          addHeader(browser, 'onCompleteError');
        }
      }
    )

    self.write(self.onCompleteError);
    self.failedSpecs = [];
  };

  self.onSpecComplete = function (browser, testResult) {
    if (testResult.success === false) {

      if (!self.failedSpecs[browser.id]) {
        self.failedSpecs[browser.id] = [];
      }
      self.failedSpecs[browser.id].push(testResult);

    }
  }
};

QuickerReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:quicker': ['type', QuickerReporter]
};