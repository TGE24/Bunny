import AccessControl from "accesscontrol";
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("patient")
    .readOwn("profile")
    .updateOwn("profile");

  ac.grant("doctor")
    .extend("patient")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
