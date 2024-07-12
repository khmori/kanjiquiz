import deck_data from '../assets/deck_index.json'

const DeckSet = ({entry, handleDeckSelect, isActive}) => {
    const data = deck_data[entry];
    const labels = data["labels"];

    return (
    <div className='set'>
        <span>{entry}</span>
        <div className='options'>
        {labels.map((option, index) => (
            <div 
            id='option'
            className={isActive(entry, index) ? 'active' : 'inactive'}
            key={index} 
            onClick={() => handleDeckSelect(entry, index)}
            >
                {option}
            </div>
        ))}
        </div>
    </div>
    )
}

export default DeckSet