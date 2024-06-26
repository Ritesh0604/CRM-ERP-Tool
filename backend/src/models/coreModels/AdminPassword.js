const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const adminPasswordSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    emailToken: String,
    resetToken: String,
    emailVerified: {
        type: Boolean,
        default: false,
    },
    authType: {
        type: String,
        default: "email",
    },
    loggedSessions: {
        type: [String],
        default: [],
    },
});

// generating a hash
adminPasswordSchema.methods.generateHash = function (salt, password) {
    return bcrypt.hashSync(salt + password);
};

// checking if password is valid
adminPasswordSchema.methods.validPassword = function (salt, userpassword) {
    return bcrypt.hashSync(salt + userpassword, this.password);
};

module.export = mongoose.model('adminPassword', adminPasswordSchema)
