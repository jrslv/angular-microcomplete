'use strict';

var directives = angular.module('myApp.directives', []);

/**
 *  This directive used in a form 
 *  `<input type="text" ng-model="sentence" microcomplete="sentence" source="terms" />`
 *  enables microcomplete from array of $scope.terms to the string $scope.sentence
 */
directives.directive('microcomplete', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var threshold = 3;
            var tabbed = false;
            /**
             * @param  String word
             * @param  Array terms
             * @return String
             */
            var matchWord = function(word, terms) {
                var search = new RegExp(",(" + word + "[^,]*),?", "gi");
                var result = search.exec("," + terms.toString());
                return result ? result[1] : "";
            };
            element.bind('keyup', function(e) {
                var sentence = scope[attr.microcomplete];
                var word = sentence.split(/[\s]/).pop();
                if (tabbed === true && word.length >= threshold) {
                    var match = matchWord(word, scope[attr.source]);
                    if (match.length) {
                        var search = new RegExp(word + "$", "gi");
                        scope.$apply(function() {
                            scope[attr.microcomplete] = sentence.replace(search, match);
                        });
                    }
                }
                tabbed = false;
            });
            element.bind('keydown', function(e) {
                if (!e) var e = window.event;
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                    tabbed = true;
                }
            });
        }
    };
});
