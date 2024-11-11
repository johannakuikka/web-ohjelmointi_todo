import { pool } from '../helpers/db.js'
import { Router } from 'express'
import { emptyOrRows } from '../helpers/utils.js'
import { auth } from '../helpers/auth.js'
import { getTasks, postTask, deleteTasks } from '../controllers/TaskController.js'

const router = Router()

router.get('/', getTasks)
router.post('/create', auth, postTask)
router.delete('/delete/:id', auth, deleteTasks)

router.get('/',(req,res) => {
    pool.query('SELECT * FROM task',(error, result) => {
        if (error) {
            return next(error)
        }
        return res.status(200).json(emptyOrRows(result))
    })
})

router.post('/create',auth,(req,res,next) => {
    pool.query('insert into task (description) values ($1) returning *',
        [req.body.description],
        (error,result) => {
            if (error) {
                return next(error)
            }
            return res.status(200).json(emptyOrRows(result))
        }
    )
})

router.delete('/delete/:id',auth,(req,res,next) => {
    const id = parseInt(req.params.id)

    pool.query('delete from task where id = $1',
        [id],
        (error,result) => {
            if (error) {
                return next(error)
            }
            return res.status(200).json(emptyOrRows(result))
        }
    )
})

export default router