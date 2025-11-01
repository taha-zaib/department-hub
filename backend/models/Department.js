import mongoose from "mongoose"
import bcrypt from "bcrypt"


// DEPARTMENT SCHEMA
const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: [true, "Department name is required"],
        trim: true,
        maxLength: [100, "Department name cannot exceed 100 characters"]
    },
    university: {
        type: true,
        required: [true, "University name is required"],
        trim: true,
        maxLength: [150, "University name annot exceed 150 characters"]
    },
    contactEmail: {
        type: String,
        required: [true, "Contact email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                return email.includes("@") &&
                       email.includes(".") &&
                       email.indexOF("@") < email.lastIndexOf(".") &&
                       email.length > 5;
            },
            message: "Please enter a valid email address"
        }
    },
    contactPerson: {
        type: String,
        required: [true, "Contact person name is required"],
        trim: true,
        maxLength: [100, "Contact persom name cannot exceed 100 characters"]
    },
    status: {
        type: String,
        eum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    adminPassword: {
        type: String
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