var fs   = require('fs');
var path = require('path');
var semver = require('semver');

module.exports = {
  name: 'ember-cli-foundation-sass',

  treeForVendor(defaultTree) {
    var map = require("broccoli-stew").map;
    var Funnel = require("broccoli-funnel");
    const mergeTrees = require('broccoli-merge-trees');

    let browserVendorLib=new Funnel('bower_components/foundation/js', {
      destDir: 'foundation',
      files: ['foundation.js']
    });
    let modernizrVendorLib=new Funnel('bower_components/modernizr', {
      destDir: 'foundation',
      files: ['modernizr.js']
    });
    let fastclickVendorLib=new Funnel('bower_components/fastclick/lib', {
      destDir: 'foundation',
      files: ['fastclick.js']
    });
    browserVendorLib = map(browserVendorLib, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    modernizrVendorLib = map(modernizrVendorLib, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    fastclickVendorLib = map(fastclickVendorLib, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    return new mergeTrees([defaultTree, browserVendorLib, modernizrVendorLib, fastclickVendorLib]);
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    if(!app.options['sassOptions']) {
      app.options['sassOptions'] = {};
    }

    if(!app.options['sassOptions'].includePaths) {
      app.options['sassOptions'].includePaths = [];
    }

    app.options['sassOptions'].includePaths.push('bower_components/foundation/scss');

    var emberCLIVersion = app.project.emberCLIVersion();
    if (semver.lt(emberCLIVersion, '0.1.2')) {
      throw new Error('ember-cli-foundation-sass requires ember-cli version 0.1.2 or greater.\n');
    }

    if (semver.lt(emberCLIVersion, '0.2.0')) {
      //Using old form to add sassOptions for old ember-clis
      //Make sure the ember-cli-sass options are set/appended in the right way (and not just overwriting)
      if(app.options['sassOptions'] && app.options['sassOptions']['includePaths']) {
        app.options['sassOptions']['includePaths'].push('bower_components/foundation/scss');
      } else {
        app.options['sassOptions'] = app.options['sassOptions'] || {};
        app.options['sassOptions']['includePaths'] = ['bower_components/foundation/scss'];
      }
    }

    if (app.options['foundation-sass']) {
      throw new Error('Using "foundation-sass" in your Brocfile is deprecated.  Please use "ember-cli-foundation-sass" instead.');
    }

    var options          = app.options['ember-cli-foundation-sass'] || {};
    if (options.modernizr) {
      app.import('vendor/foundation/modernizr.js');
    }

    if (options.fastclick) {
      app.import('vendor/foundation/fastclick.js');
    }

    app.import('vendor/foundation/foundation.js');
  }
};
