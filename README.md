# karma-quicker-reporter
A easier to read more flexible reporter plugin for Karma for use with Jasmine. 

##### Completed Goals:
1. Useful information should be colorized 
2. Unnecessary information should be removed
3. When relevant, useful info should be diffed to highlight differences
4. Should be able to set config option to only report the first error - not fail fast - just minimize the output if you only want to see the first error.
5. Should maintain error links that can be parsed by IDEs so that they can be clicked to take you to the error file/line/column.
6. Should still produce a normal Karma error even if everything else breaks. 
7. Should work in gulp and grunt task runners.
8. Should work in karma-jasmine 0.1.5. 
9. Should work with karma-jasmine 0.3.6+.

##### In Progress Goals:
10. Theme overrides on variable by variable basis. 

##### Jasmine V1
```
npm install karma-quicker-reporter-jasminev1
```
##### Jasmine V2
```
npm install karma-quicker-reporter-jasminev2
```

##### Add this to karma.conj.js:
```
quickerConfig: {
      quickQuit: false //true to only show the first error
},
```
    
```
reporters: ['quicker']
```
    
###### Turns this:
![](https://github.com/JimmyKuruvilla/karma-quicker-reporter/blob/master/test/old.png)
###### Into this:
![](https://github.com/JimmyKuruvilla/karma-quicker-reporter/blob/master/test/new.png)
