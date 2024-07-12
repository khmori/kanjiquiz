import { useState } from 'react'

import Menu from '../src/components/Menu';
import Quiz from './components/Quiz';
// import Balls from '../src/components/test';


const App = () => {
  const [ready, setReady] = useState(false);
  const [decks, setDecks] = useState([]);

  return (
    <div className='main'>
    {!ready && <Menu setReady={setReady} setDecks={setDecks}/>}
    {ready && <Quiz setReady={setReady} decks={decks}/>}
    </div>
  )
}

export default App