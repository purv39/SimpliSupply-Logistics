class User {
    constructor(email, password, type) {
        this.email = email;
        this.password = password;
        this.type = type;
    }

    toObject() {
        return {
          email: this.email,
          password: this.password,
          type: this.type,
        };
    }
}

export default User;
