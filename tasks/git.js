/*
 * grunt-git
 * https://github.com/rubenv/grunt-git
 *
 * Copyright (c) 2013 Ruben Vermeersch
 * Licensed under the MIT license.
 */

'use strict';

var commands = require('../lib/commands');

module.exports = function (grunt) {

    function wrapCommand(fn) {
        return function () {
            var self = this;

            function exec() {
                var args = Array.prototype.slice.call(arguments);
                var callback = args.pop();
                var options = self.options({
                    verbose: false
                });
                grunt.util.spawn({
                    cmd: 'git',
                    args: args,
                    opts: {
                        stdio: options.verbose ? 'inherit' : '',
                        cwd: options.cwd
                    }
                }, function () {
                    callback.apply(this, arguments);
                });
            }

            var done = self.async();
            fn(self, exec, done);
        };
    }

    for (var command in commands) {
        var fn = commands[command];
        grunt.registerMultiTask('git' + command, fn.description || '', wrapCommand(fn));
    }
};
