const userModel = require('../models/userAccount')

async function adminAccountGET(req, res) {
    var users = await userModel.find({ role: 1 })
    var admin = await userModel.find({ role: { $ne: 1 } })


    users = users.map((user) => {
        var { email, firstName, lastName, phone, address, role, status, isVerify } = user
        var formatName = `${firstName} ${lastName}`
        var formatAddress
        formatAddress = `${address.specify}, ${address.ward.name}, ${address.district.name}, ${address.province.name}`
        role = 'User'
        var status
        switch (status) {
            case true:
                status = 'active'
                break;
            case false:
                status = 'lock'
                break;
        }
        switch (isVerify) {
            case false:
                status = 'Not verify'
        }
        return { email, name: formatName, phone, address: formatAddress, role, status }
    })


    admin = admin.map((ad) => {
        var { email, firstName, lastName, phone, role, status } = ad
        var role
        var formatName = `${firstName} ${lastName}`

        switch (role) {
            case 2:
                role = 'warehouse staff'
                break;
            case 3:
                role = 'Store manager'
                break;
            case 4:
                role = 'super admin'
                break;
        }
        var status
        switch (status) {
            case true:
                status = 'Active'
                break;
            case false:
                status = 'Locking'

        }
        return { email, name: formatName, phone, status, role }
    })

    res.render('adminAccount', { users, admin })
}

async function adminAccountPUT(req, res) {
    console.log(req.body)
    var option = req.body.option
    var email = req.body.email

    if(option==''){
        res.json({ status: 0, message: 'invalid option' })
        return 
    }

    if (req.body.type && req.body.type == 'admin') {
        switch (req.body.option) {
            case 'lock':
                await userModel.findOneAndUpdate({ email: req.body.email }, { firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone, status: false })
                res.json({ status: 1, message: 'success' })
                break;

            case 'unlock':
                await userModel.findOneAndUpdate({ email: req.body.email }, { firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone, status: true })
                res.json({ status: 1, message: 'success' })
                break
        }
        return 
    }


    switch (option) {
        case 'lock':
            await userModel.findOneAndUpdate({ email: email }, { status: false })
            res.json({ status: 1, message: 'success' })
            break;
        case 'verify':
            await userModel.findOneAndUpdate({ email: email }, { isVerify: false })
            res.json({ status: 1, message: 'success' })

            break;
        case 'unlock':
            await userModel.findOneAndUpdate({ email: email }, { status: true })
            res.json({ status: 1, message: 'success' })
            break;
        default:
            res.json({ status: 0, message: 'invalid option' })
    }
}
async function adminAccountPOST(req, res) {
    var validatePhoneAndEmail = await userModel.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
    if (validatePhoneAndEmail) {
        return res.json({ status: 0, message: 'email or phone number is existed' })
    }

    new userModel({
        email: req.body.email,
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        role: parseInt(req.body.role),
        createAt:new Date()
    }).save()
    return res.json({ status: 1, message: 'success' })
}

async function adminAccountDELETE(req, res) {
    console.log(req.body)
    try {
        await userModel.findOneAndDelete({ email: req.body.email })
        res.json({ status: 1, message: 'success' })
    }
    catch (e) {
        res.json({ status: 0, message: 'fail' })
    }
}


module.exports = {
    adminAccountGET, adminAccountPUT, adminAccountPOST, adminAccountDELETE
}