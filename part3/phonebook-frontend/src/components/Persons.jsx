
const Persons = ({persons, erase}) => {

    return (
        <div>
            {persons.map(person =>
                <div key={person.id}>
                {person.name} {person.number}
                
                <button onClick = {() => erase(person.id)}>delete</button>
                </div>
            )}
        </div>
    )

}

export default Persons