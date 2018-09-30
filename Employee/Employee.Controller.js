let mongoose = require('../Model/Employee')
let employeeModel = mongoose.model('Employee')

let employeeController = function () {

    this.getAll = () => {
        return new Promise((resolve, reject) => {
            employeeModel.find().then(data => {
                resolve({ status: 200, employees: data })
            }).catch(error => {
                reject({ status: 500, message: 'Internal Server Error' })
            })
        })
    }

    this.getOne = (id) => {
        return new Promise((resolve, reject) => {
            employeeModel.findOne({ empId: id }).then(data => {
                if (data !== null) {
                    resolve({ status: 200, data: data })
                } else {
                    reject({ status: 404, message: 'Employee not found' })
                }
            }).catch(error => {
                reject({ status: 500, message: 'Internal Server Error' })
            })
        })
    }

    this.addEmployee = (req) => {
        return new Promise((reject, resolve) => {
            let reqBody = req.body
            console.log(reqBody)
            if (reqBody.type !== 'Authorized Employee' && reqBody.type !== 'Site Manager'
                && reqBody.type !== 'Senior Member of Staff' && reqBody.type !== 'Management') {
                reject({ status: 400, message: 'Employee Type is NOT Valid\nIt can only be one of the following: Authorized Employee, Site Manager, Senior Member of Staff, or Management' })
            } else {
                employeeModel.findOne({ empId: reqBody.empId }).then(data => {
                    if (data === null) {
                        let employee = new employeeModel({
                            empId: reqBody.empId,
                            type: reqBody.type,
                            firstName: reqBody.firstName,
                            lastName: reqBody.lastName,
                            address: reqBody.address,
                            email: reqBody.email,
                            phone: reqBody.phone,
                            managedSiteId: reqBody.managedSiteId,
                            role: reqBody.role
                        })
                        employee.save().then(data => {
                            resolve({ status: 201, message: 'Employee has been added' })
                        }).catch(error => {
                            reject({ status: 500, message: 'Internal Server Error' })
                        })
                    }
                    else {
                        reject({ status: 400, message: 'Employee ID is already in use' })
                    }
                }).catch(error => {
                    reject({ status: 500, message: 'Internal Server Error' })
                })
            }
        })
    }
}

module.exports = new employeeController()