export default class User {
  //email = '';
  mobile = '';
  name = '';
  userType = '';
  password = '';

  constructor(name, mobile, userType, password) {
    this.mobile = mobile;
    this.name = name;
    this.userType = userType;
    this.password = password;
  }
}
