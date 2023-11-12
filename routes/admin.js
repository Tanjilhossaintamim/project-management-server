import { Router } from 'express'

const admin = Router()

admin.get('/', async(req, res)=>{
    res.send('admin route')
})

export default admin