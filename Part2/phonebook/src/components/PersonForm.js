const PersonForm = ({onSubmit, nameValue, numberValue, nameOnChange, NumberOnChange}) => {
  return (
    <form onSubmit={onSubmit}>
    <div>
        name: <input value={nameValue} onChange={nameOnChange} />
    </div>
    <div>
        number: <input value={numberValue} onChange={NumberOnChange} />
    </div>
    <div>
        <button type="submit"
        >add</button>
    </div>
    </form>
  )
}

export default PersonForm