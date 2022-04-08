import preloader from '../../assets/images/preloader.gif'
import styles from './Preloader.module.css'

let Preloader = () => {
    return (
        <div className={styles.preloader}>
            <img src={preloader} alt="preloader"/>
        </div>
    )
}

export default Preloader