var inherits = require('util').inherits
  , UserMixin = require('roomba-server').UserMixin

var AppWizard = function (socket, name) {
  UserMixin.call(this, socket, name);
  this.score = 0;
};

inherits(AppWizard, UserMixin);

AppWizard.prototype.serializeState = function () {
  return {
    id: this.id,
    name: this.name,
    score: this.score
  };
};

module.exports = AppWizard;
