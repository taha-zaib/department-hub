import Department from '../models/department.js'


const registerDepartment = async (req, res) => {
    try {

        // extract required values from the req and trim
        const departmentName = req.body.departmentName?.trim()
        const university = req.body.university?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const admin = req.body.admin?.trim()

        // validation check
        if (!departmentName) {
            return res.status(400).json({
                success: false,
                message: 'Department name is required',
                field: 'departmentName'
            })
        }

        if (!university) {
            return res.status(400).json({
                success: false,
                message: 'University name is required',
                field: 'university'
            })
        }

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Admin name is required',
                field: 'admin'
            })
        }
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
                field: 'email'
            })
        }
        if (!email.endsWith('@university.edu')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email domain (only @university.edu allowed)',
                field: 'email'
            })
        }

        // DUPLICATE DEPARTMENT NAME OR EMAIL CHECK
        const existingDepartment = await Department.findOne({
            email: email.toLowerCase()
        })

        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: `Department with this email already exists`,
                field: 'email'
            })
        }


        // CREATE NEW DEPARTMENT
        const newDepartment = await Department.create({
            departmentName,
            university,
            email,
            admin,
            status: 'pending'
        })
        res.status(201).json({
            success: true,
            message: 'Department Registration Successful. Wait for approval!',
            data: {
                id: newDepartment._id,
                departmentName,
                university,
                email,
                admin,
                status: newDepartment.status
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed due to server error',
            error: error.message
        })
    }
}

const getDepartmentStatus = async (req, res) => {
    try {
        // DECONSTRUCT THE ID
        const { id } = req.params

        // FIND DEPARTMENT BY ID
        const department = await Department.findById(id)
        
        // validate
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found!',

            })
        }

        res.status(200).json({
            success: true,
            data: {
                departmentName: department.departmentName,
                university: department.university,
                status: department.status
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking department status',
            error: error.message
        })
    }
}

export { registerDepartment, getDepartmentStatus }