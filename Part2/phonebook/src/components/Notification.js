const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='myMessageFormat'>
        {message}
      </div>
    )
  }

  export default Notification