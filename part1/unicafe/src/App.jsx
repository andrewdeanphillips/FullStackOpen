import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const StatisticsLine = ({text, value}) => 
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>

const Statistics = ({good, neutral, bad}) => {
  const all = good+bad+neutral
  const average = (good-bad)/all
  const positivePercentage = good/all*100

  if (all == 0) {
    return <div>no feedback given</div>
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text='good' value={good} />
        <StatisticsLine text='neutral' value={neutral} />
        <StatisticsLine text='bad' value={bad} />
        <StatisticsLine text='all' value={all} />
        <StatisticsLine text='average' value={average} />
        <StatisticsLine text='positive' value={positivePercentage} />
      </tbody>
    </table>
  )

}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)





  console.log('good', good)
  console.log('neutral', neutral)
  console.log('bad', bad)
  

  return (
    <div>
      <Header text='give feedback' />
      <Button handleClick={() => setGood(good + 1)}  text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)}  text='neutral' />
      <Button handleClick={() => setBad(bad + 1)}  text='bad' />
      <Header text='statistics' />

      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App