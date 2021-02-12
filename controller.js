const fs = require('fs')
const express = require('express')

const data = fs.readFileSync(`${__dirname}/dev_data/mlm_employees_list.json`, 'utf-8')
const dataObj = JSON.parse(data)

const router = express.Router()

const makeRefCode = (length) => {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const incrementSeniorSalary = (obj, percentage) => {
  if (percentage < 1) return obj
  const seniorEmp = dataObj.filter(emp => emp.referralCode === obj.referedBy)[0]
  if (!seniorEmp) {
    return null
  }
  seniorEmp.salary = seniorEmp.salary+Math.round(obj.salary*percentage/100)
  incrementSeniorSalary(seniorEmp, Math.round(percentage/2))
}

const increementSalary = (req, res) => {
  incrementSeniorSalary(req.body, 10)
  const newUser = {...req.body}
  newUser.id = dataObj[dataObj.length-1].id + 1
  newUser.referralCode = req.body.name+'-'+makeRefCode(10)
  
  dataObj.push(newUser)

  res.status(200).json({
    status: 'success',
    data: {
      newUser
    }
  })
}

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      dataObj
    }
  })
}

router.route('/register').post(increementSalary)
router.route('/').get(getAllUsers)

module.exports = router