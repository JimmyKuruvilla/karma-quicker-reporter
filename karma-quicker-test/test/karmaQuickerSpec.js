'use strict';

describe('karma-quicker-reporter', function () {

  beforeEach(function () {

  });
  var model = {};

  var toBeObj = {a: 10, b: 22000};
  model.testObject = toBeObj;
  model.testArray = [1, 2, 3, 4];
  model.testFunction = jasmine.createSpy('testFunction').and.returnValue({});

  //model.testFunction({a: 100, b: 'jimmy', c: '11020010', d: false, e: {a: 999}})
  model.testFunction({a: 100, b: '22222'})


  describe('error types', function () {

    describe('all errors', function () {
      it('should fail all tests', function () {

        //expect(model.testObject).toEqual(['error']);

        //brackets
        //expect(model.testObject).toEqual({a:'13.990', b:'13.1', c:'15.0'});
        //expect(model.testObject).toEqual({a:{d:'13.990'}, c:{b:'13.1'}});
        //
        //expect(model.testObject).toEqual(['13.990', '13.1', '15.0']);
        //expect(model.testObject).not.toEqual({a:10, b:22000});
        //
        //expect(model.testFunction).toHaveBeenCalledWith({a:1020});
        //expect(model.testFunction).not.toHaveBeenCalledWith({a: 100, b: '22222'});
        //expect(model.testFunction).toHaveBeenCalledWith({});
        //expect(model.testFunction).toHaveBeenCalled({});
        //expect(model.testFunction).toHaveBeenCalled();
        //expect(model.testFunction).not.toHaveBeenCalled();

        //expect(model.testObject).toBe(['13.990', '13.1', '15.0']);
        //expect(model.testObject).not.toBe(toBeObj);
        //expect(model.testObject).toBe({a:10, b:22000});

        //expect(model.noExisto).toBeDefined({a:10, b:22000});
        //expect(model.noExisto).toBeDefined();
        //expect(model.testObject).toBeDefined();
        //expect(model.testObject).not.toBeDefined();
        //expect(model.testObject).not.toBeDefined({a:10, b:202});

        //expect(model.noExisto).not.toBeUndefined({3:4000});
        //expect(model.testObject).toBeUndefined({p:2222});

        //expect(model.testArray).toContain(9);
        //expect(model.testArray).not.toContain(2);

        expect('hello').not.toMatch(/.*/);
        expect('hello').toMatch(/goodbye/);

        //expect(false).toBeTruthy();
        //expect(true).not.toBeTruthy();


//change color text

      });
    });
  });
});

