import React from "react";
import Image from "next/image";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerLinks}>
                <div className={styles.footerLogo}>
                    
                    <Image 
                        src="/images/logo.png" 
                        alt="GreatCorner" 
                        width={50} 
                        height={50} 
                    />
                    <span>GreatCorner</span>
                </div>
            </div>
            <div className={styles.footerCopyright}>
                <p>&copy; GreatCorner {currentYear}</p>
            </div>
        </footer>
    );
};

export default Footer;
