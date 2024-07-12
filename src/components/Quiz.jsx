import { useState, useEffect}  from 'react';
import * as wanakana from 'wanakana';
import Papa from 'papaparse';
import TermInfo from './TermInfo';
import { Tooltip } from 'react-tooltip'

const Quiz = ({ setReady, decks }) => {
    console.log(decks);
    const [banks, setBanks] = useState([]);
    const [term, setTerm] = useState('');
    const [word, setWord] = useState('');
    const [readings, setReadings] = useState([]);
    // const [readings, setReadings] = useState([]);
    const [score, setScore] = useState(1)
    const [col, setCol] = useState("rgb(0, 158, 21)");
    const [done, setDone] = useState(false);
    const [hover, setHover] = useState(false);

    async function fetchTerms(selections) {
        try {
            const results = await Promise.all(
                selections.map(selection => {
                    return new Promise((resolve, reject) => {
                        Papa.parse('/' + selection, {
                            download: true,
                            header: true,
                            complete: (results) => resolve(results.data),
                            error: (error) => reject(error),
                        });
                    });
                })
            );

            setBanks(results);
        } catch (error) {
            console.error('Error fetching or parsing CSV files:', error);
        }
    }

    useEffect(() => {
        fetchTerms(decks);
    }, [decks]);


    //fix readings (get all possible readings)
    async function set() {
        if (banks.length) {
            const terms = banks[[Math.floor(Math.random() * banks.length)]];
            const term_info = terms[[Math.floor(Math.random() * terms.length)]];
            // const term = term_info.word;
            // setTerm(term);
            setTerm(term_info);
            setWord(term_info.word);
            setReadings([term_info.reading]);
            // const readings = [term_info.reading];
            // setReadings(readings);
        }
    }   

    useEffect(() => {
        set();
    }, [banks]);

    useEffect(() => {
        console.log(term.word);
        console.log(readings);

    }, [term, readings]);

    async function checkAnswer(e) {
        if (e.key === "Enter") {
            const input = wanakana.toKana(e.target.value);     

            if (!done) {
                if (input) {
                    if (readings.includes(input)) {
                        console.log("correct");
                        setCol("rgb(0, 158, 21)");
                        setScore(score+1);
                    } else {
                        console.log("incorrect");
                        setCol("rgb(158, 0, 0)");
                    }
                    setDone(true);
                }

            } else {
                set();
                setDone(false);
            }

            e.target.value = "";
            console.log("score: " + score);
            console.log("current readings: " + readings);
                
        }
        
    }


    function handleMenuButton() {
        setReady(false);
    }

    
    return (
    <div className='quiz'>
        <div className="menu-button-container">
            <button id="menu-button" onClick={handleMenuButton}>
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor">
                    <path d={svgPath}></path>
                </svg> */}
                menu
            </button>
        </div>


        <div className='info'>
            <div className="furigana" style={{color: col}} id="reading">
                {done ? readings.join(', ') : "⠀"}
            </div>


            <a data-tooltip-id="meaning" data-tooltip-content={term.meaning}>
                {done ? "(?)" : "⠀"}
            </a>

            <Tooltip id="meaning" />

            {/* <div className="info-toggle">{done ? "(?)" : "⠀"}</div>
            {hover && <TermInfo term={term}/>}  */}
        </div>
          
        <div className="word-display" id="word">{word}</div>

        <input className="word-input" placeholder={done ? "Press Enter to Continue" : "Answer"} autoComplete="off" onKeyDown={e => checkAnswer(e, word)}></input>


    </div>
    )
}

export default Quiz;