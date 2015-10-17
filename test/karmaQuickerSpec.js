'use strict';

describe('karma-quicker-reporter', function () {

  beforeEach(function () {
  });

  var model = {};
  model.testFunction = jasmine.createSpy('testFunction');
  model.uncalledFunction = jasmine.createSpy('uncalledFunction');
  function errorThrower (){
    throw 'mega-error';
  }

  var toBeObj = {a:'a', b:2, c:'three'};
  var definedObj = {a:'aWorD', b:2, c:'three', d:'d', e:5, f:'six'};
  var nestedObj = {first1evel:{level2:'2222'}, level1:{level2:'2222'}};

  var array1To4 = [1, 2, 3, 4];
  var arrayOfStrings = ['one','two','three','four'];
  model.testFunction(definedObj);


  describe('error types', function () {

    it('toHaveBeenCalledWith should colorize error output', function () {
      expect(model.testFunction).toHaveBeenCalledWith(nestedObj);
      expect(model.uncalledFunction).toHaveBeenCalledWith(nestedObj);
      expect(model.testFunction).toHaveBeenCalledWith({});
      expect(model.testFunction).not.toHaveBeenCalledWith(definedObj);
    });

    it('toHaveBeenCalled should colorize error output', function () {
      expect(model.uncalledFunction).toHaveBeenCalled();
      expect(model.testFunction).not.toHaveBeenCalled();
    });

    it('toEqual should colorize error output', function () {
      expect(definedObj).toEqual(arrayOfStrings);
      expect(definedObj).toEqual(nestedObj);
      expect(definedObj).not.toEqual(definedObj);
    });

    it('toHaveBeenCalled should colorize error output', function () {
      expect(model.uncalledFunction).toHaveBeenCalled();
      expect(model.testFunction).not.toHaveBeenCalled();
    });

    it('toBe should colorize error output', function () {
      expect(toBeObj).toBe(arrayOfStrings);
      expect(toBeObj).toBe(definedObj);
      expect(toBeObj).not.toBe(toBeObj);
    });

    it('toBeDefined should colorize error output', function () {
      expect(definedObj).not.toBeDefined();
      expect(definedObj).not.toBeDefined(definedObj);
    });

    it('toBeUndefined should colorize error output', function () {
      expect(definedObj).toBeUndefined(definedObj);
    });

    it('toContain should colorize error output', function () {
      expect(array1To4).toContain(10);
      expect(array1To4).not.toContain(2);
    });

    it('toMatch should colorize error output', function () {
      expect('hello').toMatch(/goodbye/);
      expect('hello').not.toMatch(/.*/);
    });

    it('toBeTruthy should colorize error output', function () {
      expect(false).toBeTruthy();
      expect('').toBeTruthy();
      expect(true).not.toBeTruthy();
    });

    it('toBeFalsy should colorize error output', function () {
      expect(true).toBeFalsy();
      expect(definedObj).toBeFalsy();
      expect(false).not.toBeFalsy();
    });

    it('toBeNull should colorize error output', function () {
      expect(definedObj).toBeNull();
      expect(null).not.toBeNull();
    });

    it('toBeGreaterThan should colorize error output', function () {
      expect(1).toBeGreaterThan(5);
      expect(5).not.toBeGreaterThan(1);
    });

    it('toBeLessThan should colorize error output', function () {
      expect(5).toBeLessThan(1);
      expect(1).not.toBeLessThan(5);
    });

    it('toThrow should colorize error output', function () {
      expect(errorThrower).toThrow(100);
      expect(errorThrower).not.toThrow();
    });

    //it('should color general errors', function () {
      //disabled until needed to test
      //ReferenceError
      //expect(undefinedObj).toEqual(definedObj);
      //expect(undefinedObj).toBeDefined(definedObj);
      //expect(undefinedObj).not.toBeUndefined(definedObj);

      //Error: does not take arguments
      //expect(model.uncalledFunction).toHaveBeenCalled(nestedObj);
    //});
  });
});

