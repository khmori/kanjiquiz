import { useState } from 'react'
import DeckSet from './DeckSet';

import deck_data from '../assets/deck_index.json'

const Menu = ({setReady, setDecks}) => { // props
    const [selected, setSelected] = useState([]);


    function handleOkButton() {
        //add all selected decks to setdecks
        setDecks(selected);
        setReady(true);
    };

    function handleDeckSelect(entry, index) {
        const data = deck_data[entry];
        const files = data["files"]; 
    
        const file = files[index];
    
        // Create a new array to update state immutably
        setSelected(prevSelected => 
            prevSelected.includes(file)
                ? prevSelected.filter(selectedFile => selectedFile !== file)
                : [...prevSelected, file]
        );
    }

    function isActive(entry, index) {
        const data = deck_data[entry];
        const files = data["files"]; 
        return selected.includes(files[index]);
    }

    return (
        <div className='menu'>
            {/* <DeckSet entry="grade" handleDeckSelect={handleDeckSelect} isActive={isActive}/>

            <DeckSet entry="JLPT" handleDeckSelect={handleDeckSelect} isActive={isActive}/> */}

            <DeckSet entry="kanken" handleDeckSelect={handleDeckSelect} isActive={isActive}/>
            <DeckSet entry="other" handleDeckSelect={handleDeckSelect} isActive={isActive}/>

            <div className ="ok-button">
                <div id="ok" onClick={handleOkButton}>ok</div>
            </div>
        </div>
  )
}

export default Menu;