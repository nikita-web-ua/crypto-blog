import {useEffect, useState} from "react";
import styles from './Editor.module.css'
import {EditorAPI} from "../../apis/EditorAPI";
import Preloader from "../Preloader/Preloader";

export const Editor = (props) => {
    const testText = 'In 1998, Wei Dai published a description of "b-money", characterized as an anonymous, distributed electronic cash system.[Shortly thereafter, Nick Szabo described bit gold. Like {{ Name/BTC }} and other cryptocurrencies that would follow it, bit gold (not to be confused with the later gold-based exchange, {{ Name/BITGOLD }}) was described as an electronic currency system which required users to complete a proof of work function with solutions being cryptographically put together and published. A currency system based on a reusable proof of work was later created by Hal Finney who followed the work of Dai and Szabo. The first decentralized cryptocurrency, {{ Name/BTC }}, was created in 2009 by pseudonymous developer Satoshi Nakamoto. It used SHA-256, a cryptographic hash function, as its proof-of-work scheme. In April 2011, {{ Name/NMC }} was created as an attempt at forming a decentralized DNS, which would make internet censorship very difficult. Soon after, in October 2011, {{ Name/LTC }} was released. It was the first successful cryptocurrency to use scrypt as its hash function instead of SHA-256. Another notable cryptocurrency, {{ Name/PPC }} was the first to use a proof-of-work/proof-of-stake hybrid'
    const regex = /{{([^{]+)\/([^}/]+)}}/g

    let [inputValue, setInputValue] = useState(testText)
    let [outputValue, setOutputValue] = useState(inputValue)
    let [coinsList, setCoinsList] = useState(null)
    let [tickerList, setTickerList] = useState(null)
    let [validationMsg, setValidationMsg] = useState(null)
    let [validationToggle, setValidationToggle] = useState(false)


    useEffect(() => {
        EditorAPI.getCoins().then(res => {
            setCoinsList(res.data)
        }).catch(error => console.error(error))

        EditorAPI.getTicker().then(res => {
            setTickerList(res.data)
        }).catch(error => console.error(error))
    }, [])

    useEffect(() => {
        setValidationToggle(false)
        setValidationMsg('')
        setOutputValue(inputValue.replaceAll(regex, (expr) => {
            let parsedArr = markerParser(expr)

            if (coinsList) {
                return (markerMethodReducer(parsedArr, expr))
            } else {
                return expr
            }

        }))
    }, [inputValue, coinsList])


    const throwErrorMsg = (error) => {
        setValidationMsg(error)
        setValidationToggle(true)
    }

    const markerParser = (str) => {
        let found = [],
            curMatch

        while (curMatch = regex.exec(str)) {
            found.push(curMatch[1].trim().toUpperCase(), curMatch[2].trim().toUpperCase());
        }

        return found
    }

    const markerMethodReducer = (parsedArr, expr) => {
        let newExpr

        switch (parsedArr[0]) {
            case 'NAME':
                if (coinsList.find(c => c.symbol === parsedArr[1])) {
                    newExpr = coinsList.find(c => c.symbol === parsedArr[1]).name
                } else {
                    throwErrorMsg('Incorrect coin symbol')
                    newExpr = expr
                }
                return newExpr

            case 'PRICE':
                if (tickerList.find(c => c.symbol === parsedArr[1])) {
                    newExpr = tickerList.find(c => c.symbol === parsedArr[1]).quotes.USD.price.toFixed(2)
                } else {
                    throwErrorMsg('Price for this coin is unavailable')
                    newExpr = expr
                }
                return newExpr

            default:
                throwErrorMsg('Invalid method type')
                return expr
        }
    }

    const onTextareaChange = e => setInputValue(e.target.value)

    if (coinsList === null || tickerList === null){
        return <Preloader />
    }

    return (
        <div className={styles.editor}>
            <div className={styles.title}>
                <h1>Editor’s prototype for a redactor of a cryptocurrencie’s blog</h1>
            </div>
            <div className={styles.inputBlock}>
                <h2>Input</h2>
                <textarea value={inputValue} onChange={onTextareaChange}/>
                {validationToggle ? <span style={{color: 'red'}}>{validationMsg}</span> : <></>}
            </div>
            <div className={styles.outputBlock}>
                <h2>Output</h2>
                <p>{outputValue}</p>
            </div>
        </div>
    )
}