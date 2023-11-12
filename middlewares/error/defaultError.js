const defaultError = (error, req, res, next)=>{
    if(error.status){
      return res.status(error.status).json({message: error.message})
    }
    res.status(500).json({message: "something went wrong"})
  }

export default defaultError