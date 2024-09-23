import { Schema } from "mongoose";
import { hashSync } from "bcrypt";
import { validatePassword, validateUsername } from "../../../../../../utils/validators/loginInputs/index.js";
import { userInstanceMethods, userStaticMethods } from "./methods/index.js";
import fileReference__subschema from "../__common/FileRef/index.js";


const userSchema = new Schema({
  name: {
    type: String,
    validate: [
      {
        validator: function(v) {
          const validation = validateUsername(v);
          if(validation.isValid) return true;
          throw validation.message;
        },
        message: props => props.reason
      }
    ],
    required: [true, "name is required"],
    
    index: {
      unique: true,
    }
    
  },
  password: {
    type: String, 
    validate: [
      {
        validator: function (v) {
          const validation = validatePassword(v);
          if(validation.isValid) return true;
          throw validation.message;
        },
        message: props => props.reason
      }
    ],
    required: [true, "password is required"],
    select: false
    
  },
  photo: fileReference__subschema
},
{
  virtuals: {
    url: {
      get: function () { return `/user/${this._id}` } 
    },
  },
  statics: userStaticMethods,
  methods: userInstanceMethods
}
);





// Hooks:

userSchema.pre("save", function(next) { // we hash the password
  const hashedPassword = hashSync(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.post("save", function(error, doc, next) {
  if (error.name === 'MongoServerError' ) {
    if(error.code === 11000) {
      next(new Error(`A user with that name already exists`));
    }
    else {
      next(new Error(`Could not register`));
    }

  } 
  else {
    next();
  }
});





export default userSchema;