import { useState } from 'react'
import './index.css'
import BoardLoop from './components/BoardLoop'
import CityStack from './components/CityStack'

function App() {
  const [cityLevel, setCityLevel] = useState(1)
  const [funds, setFunds] = useState(5000)
  const [shields, setShields] = useState(1)
  const [dice, setDice] = useState(50)

  return (
    <div className="relative min-h-screen">
      <div className="absolute left-8 top-8 bottom-8 w-1/4">
        <CityStack floorCount={cityLevel} />
      </div>

      <BoardLoop cityLevel={cityLevel} funds={funds} setFunds={setFunds} dice={dice} setDice={setDice} shields={shields} setShields={setShields} setCityLevel={setCityLevel} />
    </div>
  )
}

export default App// cache bust: 1774658839
