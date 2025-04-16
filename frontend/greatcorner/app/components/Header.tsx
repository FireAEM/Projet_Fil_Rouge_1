"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LinkButton from "@/app/components/LinkButton";
import styles from "./Header.module.css";

const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const queryParam = encodeURIComponent(searchQuery);

        if (pathname === "/annonces") {
        router.replace(`/annonces?search=${queryParam}`);
        } else {
        router.push(`/annonces?search=${queryParam}`);
        }
    };

    return (
        <header className={styles.header}>
            <Link href="/">
                <Image
                    src="/images/logo.png"
                    alt="Square Logo"
                    className={styles.headerLogo}
                    width={50}
                    height={50}
                    priority
                />
            </Link>

            <nav className={styles.headerNav}>
                <Link href="/">Acceuil</Link>
                <Link href="/annonces">Annonces</Link>
            </nav>

            <div className={styles.headerContainer}>
                <div className={styles.headerSearch}>
                    <form onSubmit={handleSearchSubmit} className={styles.headerSearchForm}>
                    <input
                        type="text"
                        placeholder="Recherche..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    </form>
                    <Image
                        src="/images/recherche.png"
                        alt="Recherche"
                        className={styles.headerSearchIcon}
                        width={25}
                        height={25}
                        priority
                    />
                </div>
                <LinkButton 
                    link="/favoris" 
                    className="headerFavoris" 
                    text="❤️ Favoris" 
                />
                <LinkButton 
                    link="/messages" 
                    className="headerMessages" 
                    text="✉️ Messages" 
                />
                <LinkButton
                    link="/connexion"
                    className="headerAccount"
                    text="🧑 Compte"
                    color="white"
                    backgroundColor="black"
                />
            </div>
        </header>
    );
};

export default Header;