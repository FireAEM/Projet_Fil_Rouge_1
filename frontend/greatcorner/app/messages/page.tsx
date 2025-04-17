"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import Message from "./components/Message";
import styles from "./page.module.css";

type RawMessage = {
    id_message: number;
    contenu: string;
    date_envoi: string;
    id_expediteur: number;
    id_recepteur: number;
};

type MessageWithSender = RawMessage & {
    firstName: string;
    lastName: string;
    email: string;
};

export default function MessagesPage() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [loading, setLoading] = useState(true);

    // Redirection si pas connecté
    useEffect(() => {
        if (loading) return;
        if (!user) {
        router.push("/connexion");
        }
    }, [user, loading, router]);

    // Fetch des messages reçus + enrichissement expéditeur
    useEffect(() => {
        if (!user) return;
        const fetchMessages = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/message/recepteur/${user.id_utilisateur}`,
                { credentials: "include" }
            );
            if (!res.ok) {
                console.error("Erreur fetch messages:", res.statusText);
                setLoading(false);
                return;
            }
            const raw: RawMessage[] = await res.json();
            const enriched = await Promise.all(
                raw.map(async (msg) => {
                    const uRes = await fetch(
                        `http://localhost:3000/utilisateur/${msg.id_expediteur}`
                    );
                    const u = uRes.ok ? await uRes.json() : null;
                    return {
                        ...msg,
                        firstName: u?.prenom ?? "Prénom",
                        lastName: u?.nom ?? "Nom",
                        email: u?.email ?? "",
                    };
                })
            );
            
            // Trier les messages du plus récent au plus ancien
            enriched.sort((a, b) => new Date(b.date_envoi).getTime() - new Date(a.date_envoi).getTime());
            
            setMessages(enriched);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchMessages();
    }, [user]);

    if (loading) return <p className={styles.loading}>Chargement...</p>;

    return (
        <div className={styles.messagesSection}>
            <h1>Mes messages</h1>
            <div className={styles.messagesListContainer}>
                {messages.length > 0 ? (
                messages.map((m) => (
                    <Message
                        key={m.id_message}
                        firstName={m.firstName}
                        lastName={m.lastName}
                        email={m.email}
                        message={m.contenu}
                        date={m.date_envoi}
                    />
                ))
                ) : (
                    <p>Aucun message reçu</p>
                )}
            </div>
        </div>
    );
}
