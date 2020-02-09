import AccessControl from "accesscontrol";
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("patient")
    .readAny("profile")
    .readOwn("profile")
    .updateAny("profile")
    .updateOwn("profile");

  ac.grant("doctor")
    .extend("patient")
    .readAny("profile");

  ac.grant("admin")
    .extend("patient")
    .extend("doctor")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
