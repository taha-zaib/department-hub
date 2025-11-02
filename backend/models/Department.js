import mongoose from "mongoose"
import bcrypt from "bcrypt"


// DEPARTMENT SCHEMA
const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: [true, "Department name is required"],
        trim: true,
        minlength: [2, "Department name must be at least 2 characters long"],
        maxLength: [100, "Department name cannot exceed 100 characters"],

        validate: {
            validator: function(name) {
                // check if its a valid name
                const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -&.()"

                // loop through the name to find if any invalid character
                for(let i = 0; i < name.length; i++) {
                    if(!allowedChars.includes(name[i])) {
                        return false;
                    }
                }

                return true; // all characters valid
            },
            message: "Department name can only contain letters, numbers, spaces, hyphens, and periods"
        }

    },
    university: {
        type: String,
        required: [true, "University name is required"],
        trim: true,
        minLength: [2, "University name must be at least 2 characters long"],
        maxLength: [150, "University name cannot exceed 150 characters"]
    },
    contactEmail: {
        type: String,
        required: [true, "Contact email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                if (!email.includes("@")) return false;
                if (!email.includes(".")) return false;
                if (email.length < 6) return false;

                const atIndex = email.indexOf("@");
                const lastDotIndex = email.lastIndexOf(".");

                // "@" should come before "."
                if (atIndex >= lastDotIndex) return false;
                // "@" cannot be the first character
                if (atIndex === 0) return false;
                // email must have something after the last dot
                if (lastDotIndex === email.length - 1) return false;

                return true;

            },
            message: "Please enter a valid email address"
        }
    },
    contactPerson: {
        type: String,
        required: [true, "Contact person name is required"],
        trim: true,
        minLength: [2, "Contact person name must be at least 2 characters long"],
        maxLength: [100, "Contact persom name cannot exceed 100 characters"],

        validate: {
            validator: function(name) {
                // check if its a valid name
                const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -'."

                // loop through the name to find if any invalid character
                for(let i = 0; i < name.length; i++) {
                    if(!allowedChars.includes(name[i])) {
                        return false;
                    }
                }

                // name should contain at least one letter
                const hasLetter = name.split("").some(char => {
                    const lowerChar = char.toLowerCase();
                    return lowerChar >= 'a' && lowerChar <= 'z';
                });

                return hasLetter;
            },
            message: "Contact person name can only contain letters, spaces, hyphens, and apostrophes"
        }

    },
    status: {
        type: String,
        eum: {
            values: ["pending", "approved", "rejected"],
            message: "Status must be either pending, approved, or rejected"
        },
        default: "pending"
    },
    adminPassword: {
        type: String,
        validate: {
            validator: function(password) {
                // only validate the password if it exists - skip validation if no password
                if (!password) return true;

                return password.length >= 6 && password.length <= 100;
            },
            message: "Password must be between 6 and 100 characters long"
        }
    }, // will be set after approval
    approvalToken: {
        type: String
    }, // to set password
    tokenExpires: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// PASSWORD HASHING USING BCRYPT - .pre() runs before an action
departmentSchema.pre('save', async function(next) {
    
    if (!this.isModified('adminPassword')) {
        return next(); // skip if the password didn't change
    }

    // error handling block
    try {
        // generate random salt data
        const salt = await bcrypt.genSalt(10)

        // replace the plain password with secure hash from password + salt
        this.adminPassword = await bcrypt.hash(this.adminPassword, salt)

        // done continue saving
        next();

    } catch (error) {
        next(error);
    }
})

// COMPARE PASSWORDS DURING LOGIN
departmentSchema.methods.comparePassword = async function(candidatePassword) {
    
    try {
        // compare plain password with hash
        const compareResult = await bcrypt.compare(candidatePassword, this.adminPassword)

        return compareResult;

    } catch (error) {
        throw error;
    }
}


// DEPARTMENT MODEL
export default mongoose.model("Department", departmentSchema)