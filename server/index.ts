import PurchaseModel from './models/PurchaseModel'
import { server } from './server'
import { connectToDatabase } from './services/database'
import logger from './services/logger'
import { v4 } from 'uuid'

const port = process.env.PORT || 3033

connectToDatabase(process.env.MONGO_URI)
  .then(async () => {
    logger.info(`Connected to mongoDB at ${process.env.MONGO_URI}`)
    const purchasesWithoutPurchaseId = await PurchaseModel.find({ purchaseId: { $exists: false } })
    purchasesWithoutPurchaseId.forEach(async purchase => {
      console.log('Updated purchase')
      await PurchaseModel.updateOne({ _id: purchase._id }, { purchaseId: v4() })
    })
    logger.info('Updated purchases')
  })
  .catch(err => {
    logger.error(`Connection to mongoDB failed at ${process.env.MONGO_URI}`)
    logger.error(err.message)
  })

server.listen(port, () => {
  logger.info(`Server started, listening to port ${port}`)
})
