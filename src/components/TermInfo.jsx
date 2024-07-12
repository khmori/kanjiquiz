import { useState, useEffect}  from 'react';

const TermInfo = ( {term} ) => {

    console.log("term" + term);
    return (
        <>{term.meaning}</>
    )
}

export default TermInfo