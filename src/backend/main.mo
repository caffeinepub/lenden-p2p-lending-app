import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Instantiate actor with persistent accessControlState and authorization
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
};
