const Header = ({ name }) => <h1>{name}</h1>

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    return sum += part.exercises
  }, 0)

  return (
    <p><b>Total of {total} exercises</b></p>
  )
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part =>
          <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Course = ({ course }) => {
  const {name, parts} = course

  return (
    <div>
      <Header name={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )

}

export default Course